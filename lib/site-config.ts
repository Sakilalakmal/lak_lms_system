export const siteConfig = {
  name: "Lak LMS",
  url: "https://lak-lms-system.vercel.app",
  description:
    "Elevate your learning experience with Lak LMS - Sri Lanka's innovative learning management system. Access high-quality courses anytime, anywhere.",
  shortDescription: "Where students meet great teachers",
  keywords: [
    "LMS",
    "Learning Management System",
    "Online Courses",
    "E-Learning",
    "Education",
    "Sri Lanka",
    "Online Education",
    "Course Management",
    "Student Learning",
    "Tutoring",
  ] as string[],
  author: {
    name: "Lak LMS Team",
    url: "https://lak-lms-system.vercel.app",
  },
  ogImage: "/opengraph-image.png",
  links: {
    github: "https://github.com/Sakilalakmal/LMS---system",
  },
} as const;

export type SiteConfig = typeof siteConfig;
