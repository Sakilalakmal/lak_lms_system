"use client";

import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface AppProps {
  courseData: CourseSidebarData["course"];
}

interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export function useCourseProgress({ courseData }: AppProps): CourseProgress {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.chapter.forEach((chapter) => {
      chapter.lesson.forEach((lesson) => {
        totalLessons += 1;

        //check if this lesson completed
        const isCompleted = lesson.lessonProgress?.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );

        if (isCompleted) {
          completedLessons += 1;
        }
      });
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [courseData]);
}
