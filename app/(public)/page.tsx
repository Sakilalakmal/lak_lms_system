import { Metadata } from "next";
import HomeClient from "./page-client";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Elevate your learning experience with Lak LMS. Discover new ways to learn and grow with our innovative, modern learning management system. Access high-quality courses anytime, anywhere.",
  openGraph: {
    title: "Lak LMS - Elevate Your Learning Experience",
    description:
      "Discover new ways to learn and grow with our innovative, modern learning management system. Access high-quality courses anytime, anywhere.",
  },
};

export default function Home() {
  return <HomeClient />;
}
