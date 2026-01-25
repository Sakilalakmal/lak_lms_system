"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Kasun Perera",
    role: "Computer Science Student",
    content:
      "This LMS has completely transformed how I study. The interactive lessons are amazing and very easy to follow.",
    initials: "KP",
  },
  {
    name: "Amara Silva",
    role: "Senior Instructor",
    content:
      "Creating courses is so intuitive. I can finally focus on teaching rather than managing technical issues.",
    initials: "AS",
  },
  {
    name: "Ruwan Dissanayake",
    role: "Professional Learner",
    content:
      "The best platform for Sri Lankan students. Highly recommended for anyone looking to upskill!",
    initials: "RD",
  },
  {
    name: "Nimali Fernando",
    role: "University Student",
    content:
      "I love the progress tracking features. It keeps me motivated to finish my assignments on time.",
    initials: "NF",
  },
  {
    name: "Shehan Jayasuriya",
    role: "Course Creator",
    content:
      "A game changer for our university. Seamless communication with students has improved our engagement significantly.",
    initials: "SJ",
  },
  {
    name: "Dilani Weerasinghe",
    role: "Teacher",
    content:
      "Very modern interface and easy to use. Great job on the user experience design!",
    initials: "DW",
  },
  {
    name: "Chamara Gunawardena",
    role: "Web Developer",
    content:
      "The technical stability of this platform is impressive. It handles heavy traffic seamlessly.",
    initials: "CG",
  },
  {
    name: "Roshni de Mel",
    role: "Marketing Student",
    content:
      "The mobile experience is smooth. I can learn on the go without any issues. Love the dark mode!",
    initials: "RM",
  },
  {
    name: "Kamal Ratnayake",
    role: "Physics Lecturer",
    content:
      "Finally, a world-class LMS made for us. The support team is also very responsive.",
    initials: "KR",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="mb-6 break-inside-avoid hover:shadow-lg transition-shadow bg-white/5 backdrop-blur-sm border-white/10 dark:bg-black/5 dark:border-white/10">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`}
        />
        <AvatarFallback>{testimonial.initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground italic">
        &quot;{testimonial.content}&quot;
      </p>
    </CardContent>
  </Card>
);

export function TestimonialSection() {
  // Split testimonials into 3 columns
  const column1 = [testimonials[0], testimonials[3], testimonials[6]];
  const column2 = [testimonials[1], testimonials[4], testimonials[7]];
  const column3 = [testimonials[2], testimonials[5], testimonials[8]];

  return (
    <section className="py-20 overflow-hidden relative">
      <h2 className="text-center text-4xl font-bold mb-12 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
        Loved by learners around the country
      </h2>

      {/* Container for the grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 h-[600px] overflow-hidden mask-linear-gradient">
        {/* Column 1 - Scroll Up */}
        <div className="relative group">
          <div className="animate-scroll-up group-hover:[animation-play-state:paused] space-y-6">
            {/* Duplicate content for seamless loop */}
            {[...column1, ...column1, ...column1].map((t, i) => (
              <TestimonialCard key={`col1-${i}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Column 2 - Scroll Down */}
        <div className="relative group hidden md:block">
          <div className="animate-scroll-down group-hover:[animation-play-state:paused] space-y-6">
            {/* Duplicate content for seamless loop */}
            {[...column2, ...column2, ...column2].map((t, i) => (
              <TestimonialCard key={`col2-${i}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Column 3 - Scroll Up */}
        <div className="relative group hidden lg:block">
          <div className="animate-scroll-up group-hover:[animation-play-state:paused] space-y-6">
            {/* Duplicate content for seamless loop */}
            {[...column3, ...column3, ...column3].map((t, i) => (
              <TestimonialCard key={`col3-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
