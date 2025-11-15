import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentData() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollmentStats = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30days: { date: string; enrollments: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    last30days.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }

  enrollmentStats.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const dayStat = last30days.find((day) => day.date === enrollmentDate);
    if (dayStat) {
      dayStat.enrollments += 1;
    }
  });

  return last30days;
}
