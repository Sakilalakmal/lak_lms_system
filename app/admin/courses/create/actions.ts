"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseInputType, courseSchema, courseInputSchema } from "@/lib/zodSchema";

import { headers } from "next/headers";

export async function createCourseAction(
  values: CourseInputType
): Promise<ApiResponse> {
  try {
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

    const data = await prisma.course.create({
      data: {
        ...finalValidation.data,
        userId: session?.user?.id!,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      message: "Failed to create course",
      status: "error",
    };
  }
}
