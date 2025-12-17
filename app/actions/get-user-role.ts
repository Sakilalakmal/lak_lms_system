"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";

export async function getUserRole() {
  try {
    const user = await requireUser();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    return userData?.role || null;
  } catch {
    return null;
  }
}
