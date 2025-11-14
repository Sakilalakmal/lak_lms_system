"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetit";
import { ArrowLeftCircleIcon, CheckCheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPaymentPage() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

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
              successfully.You should have access to your course now.
            </p>

            <Link
              href={"/dashboard"}
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 w-full",
              })}
            >
              <ArrowLeftCircleIcon className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
