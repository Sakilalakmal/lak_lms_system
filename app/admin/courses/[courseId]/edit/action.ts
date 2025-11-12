"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  courseInputSchema,
  CourseInputType,
  courseSchema,
  CourseSchemaType,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { Pridi } from "next/font/google";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function editCourse(
  data: CourseInputType,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user?.user?.id!,
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

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        message: "No Lessons for reordering",
        status: "error",
      };
    }

    const update = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(update);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    console.log("error while reordring lessons", error);
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        message: "No Chapters for reordering",
        status: "error",
      };
    }

    const update = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(update);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}
