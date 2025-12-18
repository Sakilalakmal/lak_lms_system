import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter } from "../action";
import { toast } from "sonner";

export function DeleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter({ chapterId, courseId })
      );

      if (error) {
        console.log("Error deleting chapter:", error);
        toast.error("Failed to delete chapter, try again later");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
        return;
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are You Absolutely sure</AlertDialogTitle>
          <AlertDialogDescription>
            This Action cannot be undone this will permanently delete the
            chapter
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete Chapter"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
