import { ArrowUpRightIcon, GraduationCapIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

interface EmptyCourseStateProps {
  title: string;
  description?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  href: string;
}

export function EmptyCourseState({
  title,
  description,
  buttonText = "Create New",
  icon = <GraduationCapIcon className="size-12" />,
  href,
}: EmptyCourseStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>{icon}</EmptyMedia>
        <EmptyTitle>No {title} Yet</EmptyTitle>
        <EmptyDescription>
          {description ||
            `You haven't created any ${title.toLowerCase()} yet. Get started by creating your first ${title
              .toLowerCase()
              .slice(0, -1)}.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Link href={href} className={buttonVariants({ variant: "outline" })}>
            {buttonText}
            <ArrowUpRightIcon className="ml-2 size-4" />
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
}
