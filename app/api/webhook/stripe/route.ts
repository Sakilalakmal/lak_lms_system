import { env } from "@/lib/env";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

// Disable Next.js body parsing - we need the raw body for Stripe signature verification
export const runtime = "nodejs";

export async function GET(req: Request) {
  console.log("🧪 GET request to webhook endpoint");
  return new Response(
    "Webhook endpoint is working! Use POST for actual webhooks.",
    { status: 200 }
  );
}

export async function POST(req: Request) {
  console.log("🚀 ========== WEBHOOK POST RECEIVED ==========");
  console.log("⏰ Timestamp:", new Date().toISOString());

  try {
    console.log("📥 Step 1: Reading request body...");
    // IMPORTANT: Stripe needs the raw body as a string for signature verification
    // Do NOT parse as JSON first
    const body = await req.text();
    console.log("📦 Body length:", body.length, "characters");

    console.log("📋 Step 2: Getting headers...");
    const headerList = await headers();

    const stripeSignature = headerList.get("stripe-signature");
    console.log("🔐 Stripe signature present:", !!stripeSignature);

    if (!stripeSignature) {
      console.error("❌ No Stripe signature found in headers");
      return new Response("No signature", { status: 400 });
    }

    console.log("🔍 Step 3: Constructing Stripe event...");
    console.log(
      "🔑 Using webhook secret:",
      env.STRIPE_WEBHOOK_SECRET.substring(0, 15) + "..."
    );

    let event: Stripe.Event;
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified successfully");
      console.log("📋 Event type:", event.type);
      console.log("🆔 Event ID:", event.id);
    } catch (error) {
      console.error("❌ Webhook signature verification failed:", error);
      if (error instanceof Error) {
        console.error("❌ Error message:", error.message);
      }
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
        mode: session.mode,
        subscriptionId: session.subscription,
        metadata: session.metadata,
        amount: session.amount_total,
        currency: session.currency,
      });

      const courseId = session.metadata?.courseId;
      const enrollmentId = session.metadata?.enrollmentId;
      const subscriptionType = session.metadata?.subscriptionType;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      // Validate metadata - if empty or missing required fields, reject early
      if (!session.metadata || Object.keys(session.metadata).length === 0) {
        console.log("⚠️ Checkout session has no metadata, skipping");
        return new Response("No metadata in session", { status: 400 });
      }

      // FLOW 1: Student Course Enrollment
      if (courseId && enrollmentId) {
        console.log("📚 Processing student course enrollment...");

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

        console.log("✅ Student enrollment activated successfully");
        console.log("✅ Enrollment details:", {
          enrollmentId: updatedEnrollment.id,
          courseId: courseId,
          userId: user.id,
          status: updatedEnrollment.status,
        });
        return new Response("OK", { status: 200 });
      }
      // FLOW 2: Tutor Subscription
      else if (subscriptionType === "tutor") {
        console.log("👨‍🏫 Processing tutor subscription...");
        console.log("🔍 Tutor subscription details:", {
          customerId,
          userId,
          subscriptionType,
          sessionMetadata: session.metadata,
          paymentStatus: session.payment_status,
          subscriptionId: session.subscription,
        });

        // Ensure payment is successful
        if (session.payment_status !== "paid") {
          console.log(
            "⚠️ Payment not completed yet, status:",
            session.payment_status
          );
          return new Response("Payment not completed", { status: 200 });
        }

        // Find user by Stripe customer ID
        console.log(`🔍 Looking for user with stripeCustomerId: ${customerId}`);
        const user = await prisma.user.findUnique({
          where: {
            stripeCustomerId: customerId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            stripeCustomerId: true,
          },
        });

        console.log(
          "👤 User found by stripeCustomerId:",
          user
            ? {
                id: user.id,
                email: user.email,
                role: user.role,
                stripeCustomerId: user.stripeCustomerId,
              }
            : "NOT FOUND"
        );

        if (!user) {
          // Fallback: try to find by userId in metadata
          console.log(`🔍 Fallback: Looking for user by userId: ${userId}`);
          if (userId) {
            const userById = await prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                stripeCustomerId: true,
              },
            });

            console.log(
              "👤 User found by userId:",
              userById
                ? {
                    id: userById.id,
                    email: userById.email,
                    role: userById.role,
                    stripeCustomerId: userById.stripeCustomerId,
                  }
                : "NOT FOUND"
            );

            if (userById) {
              console.log(
                `🔄 Updating user ${userById.email} (${userById.id}) role to ADMIN...`
              );
              console.log(`📊 Current role: ${userById.role}`);

              // Update user role to ADMIN and ensure stripeCustomerId is set
              const updatedUser = await prisma.user.update({
                where: {
                  id: userById.id,
                },
                data: {
                  role: "ADMIN",
                  stripeCustomerId: customerId, // Ensure this is set for future webhooks
                },
              });

              console.log(
                `✅ User ${userById.email} upgraded to ADMIN role (tutor subscription)`
              );
              console.log(`✅ Updated user data:`, {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                stripeCustomerId: updatedUser.stripeCustomerId,
              });
              return new Response("OK", { status: 200 });
            }
          }

          console.error("❌ User not found for tutor subscription");
          console.error("❌ Failed lookup details:", {
            attemptedCustomerId: customerId,
            attemptedUserId: userId,
            metadata: session.metadata,
          });
          return new Response("User not found", { status: 400 });
        }

        // Update user role to ADMIN
        console.log(
          `🔄 Updating user ${user.email} (${user.id}) role to ADMIN...`
        );
        console.log(`📊 Current role: ${user.role}`);

        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: "ADMIN",
          },
        });

        console.log(
          `✅ User ${user.email} upgraded to ADMIN role (tutor subscription)`
        );
        console.log(`✅ Updated user data:`, {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          stripeCustomerId: updatedUser.stripeCustomerId,
        });
        return new Response("OK", { status: 200 });
      } else {
        console.log(
          "⚠️ Unknown checkout session type, missing required metadata"
        );
        console.log("⚠️ Session metadata received:", session.metadata);
        return new Response("Missing required metadata", { status: 400 });
      }
    } else if (event.type === "customer.subscription.created") {
      console.log("📖 Processing subscription creation...");
      const subscription = event.data.object as Stripe.Subscription;

      console.log("💳 Subscription details:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        metadata: subscription.metadata,
      });

      const subscriptionType = subscription.metadata?.subscriptionType;
      const userId = subscription.metadata?.userId;

      if (subscriptionType !== "tutor") {
        console.log("ℹ️ Not a tutor subscription, ignoring");
        return new Response("OK", { status: 200 });
      }

      // Find user by Stripe customer ID
      console.log(
        `🔍 Looking for user with stripeCustomerId: ${
          subscription.customer as string
        }`
      );
      let user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      // Fallback to userId from metadata
      if (!user && userId) {
        console.log(`🔍 Fallback: Looking for user by userId: ${userId}`);
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });
      }

      if (!user) {
        console.error("❌ User not found for subscription");
        console.error("❌ Attempted lookup:", {
          stripeCustomerId: subscription.customer,
          userId: userId,
        });
        return new Response("User not found", { status: 400 });
      }

      // Check if subscription is active
      if (
        subscription.status === "active" ||
        subscription.status === "trialing"
      ) {
        // Update user role to ADMIN
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: "ADMIN",
          },
        });

        console.log(
          `✅ User ${user.email} upgraded to ADMIN role (subscription.created)`
        );
        console.log(`✅ Updated user:`, {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        });
      }
      return new Response("OK", { status: 200 });
    } else if (event.type === "customer.subscription.deleted") {
      console.log("📖 Processing subscription cancellation...");
      const subscription = event.data.object as Stripe.Subscription;

      console.log("💳 Subscription cancellation details:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        metadata: subscription.metadata,
      });

      const subscriptionType = subscription.metadata?.subscriptionType;

      if (subscriptionType !== "tutor") {
        console.log("ℹ️ Not a tutor subscription, ignoring");
        return new Response("OK", { status: 200 });
      }

      // Find user by Stripe customer ID
      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        console.error("❌ User not found for subscription cancellation");
        return new Response("User not found", { status: 400 });
      }

      // Downgrade user role (remove ADMIN)
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: Role.USER,
        },
      });

      console.log(`✅ User ${user.email} downgraded from ADMIN role`);
      console.log(`✅ Updated user:`, {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      });
      return new Response("OK", { status: 200 });
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
