"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import {
  CourseInputType,
  courseSchema,
  courseInputSchema,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";

import { headers } from "next/headers";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function createCourseAction(
  values: CourseInputType
): Promise<ApiResponse> {
  const Usersession = await requireAdmin();
  try {
    const req = await request();
    // @ts-expect-error - Arcjet withRule() typing issue in beta version
    const decision = await aj.protect(req, {
      fingerprint: Usersession?.user?.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          message: "You are a bot",
          status: "error",
        };
      }
    }

    // First validate the input format
    const inputValidation = courseInputSchema.safeParse(values);

    if (!inputValidation.success) {
      console.log("Input validation failed:", inputValidation.error.issues);
      return {
        status: "error",
        message: "Invalid input data",
      };
    }

    // Convert strings to numbers for final validation
    const convertedData = {
      ...inputValidation.data,
      price: parseFloat(inputValidation.data.price),
      duration: parseInt(inputValidation.data.duration, 10),
    };

    // Validate the converted data
    const finalValidation = courseSchema.safeParse(convertedData);

    if (!finalValidation.success) {
      console.log("Final validation failed:", finalValidation.error.issues);
      return {
        status: "error",
        message: "Invalid data format",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Create Stripe product with price
    const stripeProduct = await stripe.products.create({
      name: finalValidation.data.title,
      description: finalValidation.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: finalValidation.data.price * 100,
      },
    });

    console.log("Stripe product created:", stripeProduct.id);
    console.log("Stripe price ID:", stripeProduct.default_price);

    // Create course in database
    const course = await prisma.course.create({
      data: {
        ...finalValidation.data,
        userId: session?.user?.id,
        stripePriceId: stripeProduct.default_price as string,
      },
    });

    console.log("Course created successfully:", course.id);

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.error("❌ Error creating course:");
    console.error("Error name:", (error as Error).name);
    console.error("Error message:", (error as Error).message);
    console.error("Full error:", error);

    if (error instanceof Error && error.message.includes("stripePriceId")) {
      return {
        message:
          "Database schema issue with stripePriceId field. Please regenerate Prisma client.",
        status: "error",
      };
    }

    return {
      message: `Failed to create course: ${(error as Error).message}`,
      status: "error",
    };
  }
}
