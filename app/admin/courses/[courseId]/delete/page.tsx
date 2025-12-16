"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { Loader, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";


export default function DeleteCourse() {
  const [isPending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        console.log("error while deleting course", error);
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/admin/courses");
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are You Sure you want to delete this course ?</CardTitle>
          <CardDescription>This action can not be undone</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href={`/admin/courses/`}
          >
            Cancel
          </Link>
          <Button
            variant={"destructive"}
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                Deleting ...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Yes Delete this course
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
