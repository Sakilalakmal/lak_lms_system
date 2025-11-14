"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { EnrollInCourseAction } from "../actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(EnrollInCourseAction(courseId));

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        
        // Redirect to Stripe checkout if URL is provided
        if (data.data?.checkoutUrl) {
          window.location.href = data.data.checkoutUrl;
        }
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="size-4 animate-spin" />
          processing...
        </>
      ) : (
        <>Enroll Now</>
      )}
    </Button>
  );
}
