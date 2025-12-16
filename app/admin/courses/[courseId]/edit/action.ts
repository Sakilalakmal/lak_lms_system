"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseInputSchema,
  CourseInputType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { Pridi } from "next/font/google";

const aj = arcjet.withRule(
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
    // @ts-expect-error - Arcjet withRule() typing issue in beta version
    const decision = await aj.protect(req, {
      fingerprint: user?.user?.id,
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

export async function CreateChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      console.log("Chapter validation failed:", result.error.issues);
      return {
        status: "error",
        message: "Invalid chapter data",
      };
    }

    //create a new chapter
    await prisma.$transaction(async (tx) => {
      const maxPos = tx.chapter.findFirst({
        where: { courseId: values.courseId },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: ((await maxPos)?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${values.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error) {
    console.log("failed to create a chapter");

    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function CreateLession(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      console.log("Chapter validation failed:", result.error.issues);
      return {
        status: "error",
        message: "Invalid chapter data",
      };
    }

    //create a new chapter
    await prisma.$transaction(async (tx) => {
      const maxPos = tx.lesson.findFirst({
        where: { chapterId: result.data.chapterId },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: ((await maxPos)?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lession created successfully",
    };
  } catch (error) {
    console.log("failed to create a lession");

    return {
      status: "error",
      message: "Failed to create lession",
    };
  }
}

export async function deleteLession({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lesson: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessions = chapterWithLessons.lesson;

    const lessionToDelete = lessions.find((lesson) => lesson.id === lessonId);

    if (!lessionToDelete) {
      return {
        status: "error",
        message: "Lession not found",
      };
    }

    const remainingLession = lessions.filter(
      (lesson) => lesson.id !== lessonId
    );

    const update = remainingLession.map((lession, index) => {
      return prisma.lesson.update({
        where: {
          id: lession.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...update,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lession deleted and lessions reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const courseWithChapter = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapter: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapter) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapter.chapter;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "This chapter can't be found in this course",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const update = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...update,
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and chapters reordered successfully",
    };
  } catch (error) {
    console.log("Error deleting chapter:", error);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
