"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/learning.png";
import { ModeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropDown } from "./UserDropDown";

const navigationItem = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

export function NavBar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex min-h-16 items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={logo} alt="Logo" className="size-9" />
          <span>LakLMS.</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6 gap-4">
          {navigationItem.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {isPending ? null : session ? (
            <UserDropDown email={session.user.email} name={session.user.name} image={session.user.image || ""}/>
          ) : (
            <>
              <Link
                href={"/login"}
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
              <Link
                href={"/login"}
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
