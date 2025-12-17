"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetit";
import { Role } from "@/lib/generated/prisma";
import { ArrowLeftCircleIcon, CheckCheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface SuccessPaymentPageProps {
  role: Role | null | undefined;
}

export function SuccessPaymentPageCompo(role: SuccessPaymentPageProps) {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  const isAdmin = role.role === "ADMIN";

  return (
    <div className="w-full min-h-screen flex flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckCheckIcon className="size-12 p-2 bg-green-500/30 rounded-full" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">payment Successfull</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Thank you for your purchase! Your payment has been processed
              successfully.spend great time with great lectures.
            </p>

            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 w-full",
              })}
            >
              <ArrowLeftCircleIcon className="size-4" />
              {isAdmin ? "Go to tutor Dashboard" : "Go to Dashboard"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
