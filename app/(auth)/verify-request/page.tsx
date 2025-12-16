"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

function VerifyRequestContent() {
  const [otp, setOtp] = useState("");
  const [emailPending, startEmailTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const router = useRouter();
  const isOtpCompleted = otp.length === 6;

  //verfy otp function
  function verifyOtp() {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully.");
            router.push("/");
          },
          onError: (error) => {
            toast.error("error verifying email otp");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          Please check your email <Send className="size-4" />
        </CardTitle>
        <CardDescription>
          We have sent you a verification link to your email address. Please
          paste the code below to complete your sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(e) => setOtp(e)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6 digit code sent to your email
          </p>
        </div>

        <Button
          className="w-full mt-2"
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
        >
          Verify Email Account
        </Button>
      </CardContent>
    </Card>
  );
}

function VerifyRequest() {
  return (
    <Suspense fallback={
      <Card className="w-full mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    }>
      <VerifyRequestContent />
    </Suspense>
  );
}

export default VerifyRequest;
