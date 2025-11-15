import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/CourseContent";

type Params = Promise<{
  lesson: string;
}>;

export default async function LessonContentPage({
  params,
}: {
  params: Params;
}) {
  const { lesson } = await params;

  const data = await getLessonContent(lesson);

  return <CourseContent data={data} />;
}
