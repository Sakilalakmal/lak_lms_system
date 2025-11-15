"use client";

import { LessonContent } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/renderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-contruct";
import { BookIcon, CheckCircle2Icon } from "lucide-react";
import { useTransition } from "react";
import { MarklessonAsComplete } from "../action";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetit";

interface CourseContentProps {
  data: LessonContent;
}

export function CourseContent({ data }: CourseContentProps) {
  const { triggerConfetti } = useConfetti();

  const [isPending, startTransition] = useTransition();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    //if we do not have video key
    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet...
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        />
      </div>
    );
  }

  //mark as complete handler
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarklessonAsComplete(data.id, data.Chapter.Course.slug)
      );

      if (error) {
        toast.error("Failed to mark lesson as complete.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button>
            <CheckCircle2Icon className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={isPending}>
            <CheckCircle2Icon className="size-4 mr-2 text-green-500" />
            {isPending ? "Completing..." : "Mark as Complete"}
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
