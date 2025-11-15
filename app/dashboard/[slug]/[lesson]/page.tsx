import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/CourseContent";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Params = Promise<{
  lesson: string;
}>;

export default async function LessonContentPage({
  params,
}: {
  params: Params;
}) {
  const { lesson } = await params;

  return (
    <Suspense fallback={<CourseContentSkeleton />}>
      <LessonContentLoadingLoader lessonId={lesson} />
    </Suspense>
  );
}

async function LessonContentLoadingLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);

  return <CourseContent data={data} />;
}

function CourseContentSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      {/* Video Player Skeleton */}
      <Skeleton className="aspect-video bg-muted rounded-lg" />

      {/* Button Skeleton */}
      <div className="py-4 border-b">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3 pt-3">
        {/* Title Skeleton */}
        <Skeleton className="h-9 w-3/4" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
