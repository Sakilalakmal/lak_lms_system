import { AdminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonEditForm } from "./_components/LessonForm";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonIdPage({ params }: { params: Params }) {
  const { chapterId, lessonId, courseId } = await params;

  const lesson = await AdminGetLesson(lessonId);

  return (
    <LessonEditForm data={lesson} chapterId={chapterId} courseId={courseId} />
  );
}
