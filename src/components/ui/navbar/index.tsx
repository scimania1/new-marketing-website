"use client";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import MobileNav from "./nav-mobile";
import MainNav from "./nav-main";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky left-0 top-0 z-30">
      <nav
        className="border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
        aria-label="primary-navigation"
      >
        <MaxWidthWrapper>
          <div className="flex items-center justify-between px-6 py-3 md:gap-4 md:px-8 lg:gap-6">
            <Link className="z-30" href="/">
              <Image
                src="/Logo.png"
                className="z-30 h-auto w-14 object-contain outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                alt="Modern Engineers (India) Logo"
                priority
                width={56}
                height={75}
                quality={100}
              />
            </Link>
            <MobileNav />
            <MainNav />
          </div>
        </MaxWidthWrapper>
      </nav>
    </header>
  );
}
