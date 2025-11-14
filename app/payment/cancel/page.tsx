import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftCircleIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function CancelPaymentPage() {
  return (
    <div className="w-full min-h-screen flex flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 rounded-full" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              No need to worry , you wont be charged Please try again !
            </p>

            <Link
              href={"/"}
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 w-full",
              })}
            >
              <ArrowLeftCircleIcon className="size-4" />
              Go back to home page
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
