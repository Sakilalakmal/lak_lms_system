import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function GET(req: Request) {
  console.log("🧪 GET request to webhook endpoint");
  return new Response(
    "Webhook endpoint is working! Use POST for actual webhooks.",
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const headerList = await headers();
    const allHeaders = Object.fromEntries(headerList.entries());

    const stripeSignature = headerList.get("stripe-signature");

    if (!stripeSignature) {
      return new Response("No signature", { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified successfully");
    } catch (error) {
      return new Response(`Webhook Error: ${error}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      console.log("📖 Step 5: Processing checkout session completion...");
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("💳 Checkout session details:", {
        sessionId: session.id,
        customerId: session.customer,
        customerEmail: session.customer_email,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
        amount: session.amount_total,
        currency: session.currency,
      });

      const courseId = session.metadata?.courseId;
      const enrollmentId = session.metadata?.enrollmentId;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (!courseId || !enrollmentId) {
        return new Response("Missing required metadata", { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
        },
      });

      if (!user) {
        if (userId) {
          const userById = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              name: true,
              stripeCustomerId: true,
            },
          });
          console.log("👤 User found by ID:", userById);
        }

        return new Response("User not found", { status: 400 });
      }

      const currentEnrollment = await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },
        select: {
          id: true,
          status: true,
          amount: true,
          userId: true,
          courseId: true,
        },
      });

      if (!currentEnrollment) {
        return new Response("Enrollment not found", { status: 400 });
      }

      const updatedEnrollment = await prisma.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "Active",
          // Convert from cents to dollars
          amount: Math.round((session.amount_total || 0) / 100),
        },
      });
    } else {
      console.log("ℹ️ Ignoring event type:", event.type);
    }

    console.log("✅ Webhook processed successfully, returning 200");
    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error object:", {
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
    }

    return new Response(`Webhook processing failed: ${error}`, { status: 500 });
  }
}
