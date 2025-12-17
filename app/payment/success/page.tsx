import { requireUser } from "@/app/data/user/require-user";
import { SuccessPaymentPageCompo } from "../_components/SuccessPage";
import { Role } from "@/lib/generated/prisma";

export default async function SuccessPaymentPage() {
  const user = await requireUser();

  return <SuccessPaymentPageCompo role={user?.role as Role} />;
}
