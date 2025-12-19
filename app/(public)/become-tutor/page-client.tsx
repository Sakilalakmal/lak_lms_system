"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield } from "lucide-react";
import { CreateTutorSubscriptionAction } from "@/app/actions/tutor-subscription-action";
import { useState } from "react";
import { toast } from "sonner";

export default function BecomeTutorPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const data = await CreateTutorSubscriptionAction();

      if (data?.status === "error") {
        toast.error(data?.message || "Failed to start subscription process");
        setIsLoading(false);
        return;
      }

      if (data?.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    } catch {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <Badge variant="outline" className="text-base px-4 py-2">
          Become a Tutor
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold ">
          Share Your Knowledge,
          <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
            Inspire Students
          </span>{" "}
          Worldwide
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
          Join our community of expert tutors and start creating impactful
          courses today. Get access to powerful tools and analytics to grow your
          teaching business.
        </p>
      </div>
      {/* Pricing Card */}
      <Card className="max-w-xl mx-auto border-2 border-blue-500/20 shadow-xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="inline-block">
            <Badge className="bg-linear-to-r  border-0 px-4 py-1">
              Best price
            </Badge>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">
            Tutor Subscription{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
              $10
            </span>
          </CardTitle>
          <p className="text-muted-foreground">
            Everything you need to start teaching and earning
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Unlimited Course Creation</p>
                <p className="text-sm text-muted-foreground">
                  Create as many courses as you want
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Full Admin Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  Access to all admin features and tools
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Student Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Track student progress and engagement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-muted-foreground">
                  Get help when you need it most
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Revenue Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Earn from every course enrollment
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="icon-sm"
            className="w-full h-10 bg-linear-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white  text-lg "
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <span className="text-sm font-bold">
                Start Your Tutor Journey
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </CardContent>
      </Card>

      {/* Trust Badge */}
      <div className="text-center mt-16 space-y-4">
        <p className="text-sm text-muted-foreground">
          Trusted by educators worldwide
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <Shield className="h-4 w-4" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
}
