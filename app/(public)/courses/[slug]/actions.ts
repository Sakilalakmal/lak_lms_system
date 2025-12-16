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
    max: 5,
  })
);

export async function EnrollInCourseAction(
  courseId: string
): Promise<ApiResponse> {
  try {
    const user = await requireUser();
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user?.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "This Course not found.",
      };
    }

    let stripeCustomerId: string;
    const userWithStripeId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
        email: true,
        name: true,
      },
    });

    if (userWithStripeId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeId.stripeCustomerId;
    } else {
      if (!userWithStripeId?.email) {
        return {
          status: "error",
          message: "User email is required to create Stripe customer.",
        };
      }

      const customer = await stripe.customers.create({
        email: userWithStripeId.email,
        name: userWithStripeId.name || userWithStripeId.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: course.id,
            userId: user.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (existingEnrollment?.status === "Active") {
        return {
          alreadyEnrolled: true,
          checkoutUrl: null,
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }

      const checkOutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1STFwrEQSNuedsZHXJScEfpv",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        alreadyEnrolled: false,
        checkoutUrl: checkOutSession.url,
      };
    });

    if (result.alreadyEnrolled) {
      return {
        status: "error",
        message: `You are already enrolled in this course`,
      };
    }

    // Return the checkout URL instead of redirecting
    return {
      status: "success",
      message: "Redirecting to checkout...",
      data: {
        checkoutUrl: result.checkoutUrl!,
      },
    };
  } catch (error) {
    console.error("Enrollment error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: `Stripe error: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "Failed to enroll in course.",
    };
  }
}
