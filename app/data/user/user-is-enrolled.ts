import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { headers } from "next/headers";
import { use } from "react";

export async function checkIfAlreadyBaughtCourse(
  courseId: string
): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        userId: session?.user.id,
        courseId: courseId,
      },
    },
    select: {
      status: true,
      id: true,
    },
  });

  return enrollment?.status === "Active" ? true : false;
}
