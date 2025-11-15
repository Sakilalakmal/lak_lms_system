import { getCourseSideBarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface CourseSlugRoutesProps {
  params: Promise<{ slug: string }>;
}

export default async function courseSlugRoutes({
  params,
}: CourseSlugRoutesProps) {
  const { slug } = await params;

  const course = await getCourseSideBarData(slug);

  const firstChapter = course?.course.chapter[0];
  const firstLesson = firstChapter?.lesson[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-4">No Lessons Available</h2>
      <p className="text-muted-foreground">
        This Course does not have any lessons yet...!
      </p>
    </div>
  );
}
