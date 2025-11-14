import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentData } from "../data/admin/admin-get-enrollemnt-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recet-courses";
import { EmptyCourseState } from "@/components/general/EmptyCourseState";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./courses/_components/Admin-course-card";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrollmentData();

  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({
              variant: "link",
            })}
            href={"/admin/courses"}
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<AdminCourseCardSkeleton />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyCourseState
        buttonText="create a new course"
        description="hey there you dont have any courses yet try to add one or waiting..."
        href="/admin/courses/create"
        title="courses"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard data={course} key={course.id} />
      ))}
    </div>
  );
}
