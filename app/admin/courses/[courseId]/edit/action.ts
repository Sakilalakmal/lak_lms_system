"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  courseInputSchema,
  CourseInputType,
  courseSchema,
  CourseSchemaType,
} from "@/lib/zodSchema";

export async function editCourse(
  data: CourseInputType,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    // First validate the input format
    const inputValidation = courseInputSchema.safeParse(data);

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

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...finalValidation.data,
      },
    });
    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    console.log("Error updating course:", error);
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}
