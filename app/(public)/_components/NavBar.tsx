"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/learning.png";
import { ModeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropDown } from "./UserDropDown";
import { GraduationCap, LayoutDashboard } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getUserRole } from "@/app/actions/get-user-role";

const navigationItem = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

export function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Only fetch role if we have a session and aren't already fetching
    if (session?.user && !isFetchingRef.current) {
      isFetchingRef.current = true;
      getUserRole()
        .then((role) => setUserRole(role))
        .finally(() => {
          isFetchingRef.current = false;
        });
    }
  }, [session]);

  const isAdmin = userRole === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex min-h-16 items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={logo} alt="Logo" className="size-20" />
          <span>LakLMS.</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6 gap-4">
          {navigationItem.map((item) => (
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
            <>
              {/* Show admin links for admins, become tutor button for non-admins */}
              {isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  href="/become-tutor"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "border-blue-500/50 hover:bg-blue-500/10",
                  })}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Become a Tutor
                </Link>
              )}
              <UserDropDown
                email={session.user.email}
                name={
                  session?.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("@")[0]
                }
                image={
                  session?.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
              />
            </>
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
