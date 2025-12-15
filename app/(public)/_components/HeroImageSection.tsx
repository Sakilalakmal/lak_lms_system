import Image from "next/image";
import subhero from "@/public/sub-hero.png";

export function HeroImageSection() {
  return (
    <div className="mx-auto 2xl:max-w-7xl">
      <div className="relative">
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-muted/50 via-transparent to-transparent dark:from-background" />

        {/* Image container with 3D perspective effect */}
        <div className="perspective-distant pl-8 lg:pl-44">
          <div className="lg:h-176 rotate-x-20 mask-b-from-55% mask-b-to-100% mask-r-from-75% skew-x-12 pl-6 pt-6">
            <Image
              className="rounded-lg border shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-900/50"
              src={subhero}
              alt="Platform preview"
              width={2880}
              height={2074}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
