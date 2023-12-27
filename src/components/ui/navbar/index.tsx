"use client";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import MobileNav from "./nav-mobile";
import MainNav from "./nav-main";

export default function Navbar() {
  return (
    <header className="sticky z-30 top-0 left-0">
      <nav
        className="bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50"
        aria-label="primary-navigation"
      >
        <MaxWidthWrapper>
          <MobileNav />
          <MainNav />
        </MaxWidthWrapper>
      </nav>
    </header>
  );
}
