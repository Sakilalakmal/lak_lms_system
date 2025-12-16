import { getAllCourses } from "@/app/data/course/get-all-course";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourse-card";
import { Suspense } from "react";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default function PublicCoursesRoute() {
  return (
    <div className="mt-8">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our all courses here to enhance your skills and knowledge.
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderingCourses />
      </Suspense>
    </div>
  );
}

async function RenderingCourses() {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
