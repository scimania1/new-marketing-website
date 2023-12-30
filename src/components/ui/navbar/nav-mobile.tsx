"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import navigationLinks, { Icon } from "./links";
import { Separator } from "../separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function HamburgerIcon() {
  return (
    <div className="hamburger-icon flex h-full w-full flex-col items-center justify-center"></div>
  );
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActiveLink = (url: string) => {
    return url === pathname;
  };

  const handleClick = () => {
    setIsOpen((curr) => !curr);
  };

  // handle the scrolling when hamburger menu is open
  useEffect(() => {
    if (typeof window !== undefined && window.document) {
      if (isOpen) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "";
      }
    }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* FIXME: Change the Icon */}
      <Button
        variant="outline"
        size="icon"
        className="hamburger-btn group relative z-30 h-8 w-8 rounded-lg p-1 sm:h-10 sm:w-10"
        data-open={isOpen}
        onClick={handleClick}
        aria-label="Button to open the Navigation Links Menu"
      >
        <HamburgerIcon />
      </Button>
      {/*the main drawer is going to be here*/}
      <div
        className={`${
          isOpen ? "flex flex-col gap-2" : "hidden"
        } fixed left-0 right-0 top-full h-screen overflow-y-scroll bg-background px-6 py-3`}
        aria-label="Mobile Navigation Links container"
        aria-hidden={!isOpen}
        aria-expanded={isOpen}
      >
        {navigationLinks.map((navigationLink, idx) => (
          <React.Fragment key={idx}>
            <Link
              className={cn(
                "flex gap-4 rounded-md px-4 py-3 text-slate-500",
                isActiveLink(navigationLink.url) &&
                  "bg-slate-200/60 text-slate-800",
              )}
              href={navigationLink.url}
              onClick={handleClick}
            >
              <Icon
                url={navigationLink.url}
                className={cn(
                  "stroke-slate-500",
                  isActiveLink(navigationLink.url) && "stroke-slate-800",
                )}
              />
              <span>{navigationLink.name}</span>
            </Link>
            {idx !== navigationLinks.length && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
