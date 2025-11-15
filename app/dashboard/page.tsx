import { EmptyCourseState } from "@/components/general/EmptyCourseState";
import { getAllCourses } from "../data/course/get-all-course";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourse-card";
import Link from "next/link";
import { PlayCircleIcon } from "lucide-react";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Your Enrolled Courses </h1>
        <p className="text-muted-foreground text-sm">
          Here You can see all the courses you have access to watch
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyCourseState
          title="courses"
          href="/courses"
          description="You currently do  not have any puchased courses yet browse our courses"
          buttonText="browse courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.Course.id} data={course} />
          ))}
        </div>
      )}

      <section className="mt-12">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Available Courses </h1>
          <p className="text-muted-foreground text-sm">
            browse all courses available now
          </p>
        </div>

        {allCourses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyCourseState
            title="courses"
            href="/courses"
            description="You purchased all available courses"
            buttonText="browse courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {allCourses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
