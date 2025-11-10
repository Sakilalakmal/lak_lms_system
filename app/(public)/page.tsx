"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";


interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Course Management",
    description:
      "Easily create, organize, and manage courses with our intuitive course management tools.",
    icon: "📚",
  },
  {
    title: "Interactive Learning Experience",
    description:
      "Engage students with multimedia content, quizzes, and assignments to enhance their learning experience.",
    icon: "🎓",
  },
  {
    title: "Progress Tracking and Analytics",
    description:
      "Monitor student progress and performance with detailed analytics and reporting features.",
    icon: "📈",
  },
  {
    title: "Seamless Communication",
    description:
      "Facilitate communication between instructors and students through messaging and discussion forums.",
    icon: "💏",
  },
];

export default function Home() {


  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>
            The Sri Lankan Future of online Education
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Elevate Your Learning Experience
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover new ways to learn and grow with our innovative , modern
            learning management system. Access high quality courses anytime ,
            anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </section>
    </>
  );
}
