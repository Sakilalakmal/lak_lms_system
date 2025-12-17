"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  })
);

export async function CreateTutorSubscriptionAction(): Promise<
  ApiResponse<{ checkoutUrl: string }>
> {
  try {
    const user = await requireUser();
    const req = await request();
    // @ts-expect-error - Arcjet withRule() typing issue in beta version
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    // Check if user is already an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, email: true, name: true, stripeCustomerId: true },
    });

    if (currentUser?.role === "ADMIN") {
      return {
        status: "error",
        message: "You are already a tutor/admin.",
      };
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;

    if (currentUser?.stripeCustomerId) {
      stripeCustomerId = currentUser.stripeCustomerId;
    } else {
      if (!currentUser?.email) {
        return {
          status: "error",
          message: "User email is required to create Stripe customer.",
        };
      }

      const customer = await stripe.customers.create({
        email: currentUser.email,
        name: currentUser.name || currentUser.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    // Get the default price for this product
    const prices = await stripe.prices.list({
      product: env.STRIPE_TUTOR_PRODUCT_ID,
      active: true,
      limit: 1,
    });

    if (!prices.data || prices.data.length === 0) {
      return {
        status: "error",
        message: "No active pricing found for tutor subscription.",
      };
    }

    const priceId = prices.data[0].id;

    // Create checkout session for subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${env.BETTER_AUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
        subscriptionType: "tutor",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          subscriptionType: "tutor",
        },
      },
    });

    return {
      status: "success",
      message: "Redirecting to checkout...",
      data: {
        checkoutUrl: checkoutSession.url!,
      },
    };
  } catch (error) {
    console.error("Tutor subscription error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: `Stripe error: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "Failed to create subscription checkout.",
    };
  }
}
