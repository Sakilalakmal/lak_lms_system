"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PictureSection } from "./_components/Picture-Section";
import { HeroImageSection } from "./_components/HeroImageSection";
import { TechStackSection } from "./_components/TechStackSection";
import {
  Book,
  GitGraph,
  GraduationCap,
  LucideProps,
  Phone,
} from "lucide-react";
import React from "react";
import { buttonVariants } from "@/components/ui/button";

interface featureProps {
  title: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Course Management",
    description:
      "Easily create, organize, and manage courses with our intuitive course management tools.",
    icon: Book,
  },
  {
    title: "Interactive Learning Experience",
    description:
      "Engage students with multimedia content, quizzes, and assignments to enhance their learning experience.",
    icon: GraduationCap,
  },
  {
    title: "Progress Tracking and Analytics",
    description:
      "Monitor student progress and performance with detailed analytics and reporting features.",
    icon: GitGraph,
  },
  {
    title: "Seamless Communication",
    description:
      "Facilitate communication between instructors and students through messaging and discussion forums.",
    icon: Phone,
  },
];

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

      <section className="mt-32">
        <h2 className="text-center text-4xl font-bold mb-12 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-3 rounded-lg bg-linear-to-r from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
