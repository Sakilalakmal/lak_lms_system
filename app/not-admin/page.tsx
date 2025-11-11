import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl mt-4">Access Restricted</CardTitle>
          <CardDescription>
            Hey there! it seems like you are not have right to create a course
            or stuff like that..
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link
            href={"/"}
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
