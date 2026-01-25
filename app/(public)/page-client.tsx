"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PictureSection } from "./_components/Picture-Section";
import { HeroImageSection } from "./_components/HeroImageSection";
import { TechStackSection } from "./_components/TechStackSection";
import { TestimonialSection } from "@/components/TestimonialSection";

import React from "react";
import { buttonVariants } from "@/components/ui/button";

// Features data removed

export default function HomeClient() {
  return (
    <>
      <section className="relative py-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>
            The Sri Lankan Future of online Education
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
            Elevate Your Learning Experience
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover new ways to learn and grow with our innovative , modern
            learning management system. Access high quality courses anytime ,
            anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href={"/courses"}
            >
              Explore Courses
            </Link>

            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href={"/login"}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <HeroImageSection />
      <TechStackSection />
      <PictureSection />

      <TestimonialSection />
    </>
  );
}
