"use client";

import { AllPublicCoursesType } from "@/app/data/course/get-all-course";
import { EnrolledCoursesType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-contruct";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { School2Icon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicCourseCardProps {
  data: EnrolledCoursesType;
}

export function CourseProgressCard({ data }: PublicCourseCardProps) {
  const thumbnailUrl = useConstructUrl(data.Course.fileKey || "");
  const { totalLessons, progressPercentage, completedLessons } =
    useCourseProgress({ courseData: data.Course as any });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail of course image"
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/dashboard/${data.Course.slug}`}
        >
          {data.Course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-4">
          {data.Course.smallDescription}
        </p>

        <div className="mt-2">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress:</span>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons} / {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({
            variant: "secondary",
            className: "mt-4 w-full justify-center",
          })}
        >
          See More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      {/* Badge skeleton */}
      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Image skeleton */}
      <Skeleton className="w-full rounded-t-xl aspect-video" />

      <CardContent className="p-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Icons and info section skeleton */}
        <div className="flex items-center mt-4 gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-9 w-full mt-4 rounded-md" />
      </CardContent>
    </Card>
  );
}
