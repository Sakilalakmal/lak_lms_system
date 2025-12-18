"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";

export async function UpdateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid inputs for lesson update",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
      },
    });

    return {
      status: "success",
      message: "Lesson added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}
