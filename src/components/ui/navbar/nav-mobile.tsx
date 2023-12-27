"use client";

import Image from "next/image";
import Logo from "@/assets/MEI Logo.png";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import navigationLinks, { Icon } from "./links";
import { Separator } from "../separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// function HamburgerIcon() {
//   return (
//     <svg
//       width="50"
//       height="50"
//       viewBox="0 0 100 100"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="hamburger-svg scale-[-1] stroke-gray-600"
//     >
//       <line
//         x1="16"
//         y1="49.7935"
//         x2="84"
//         y2="49.7935"
//         strokeWidth="5"
//         className="hamburger__middle-line"
//       />
//       <path
//         d="M16 30.7935H81.875C81.875 26.9602 81.875 18.2936 81.875 16.2936C81.875 10.7936 80.175 8.96022 79.325 8.29355C76.265 5.89355 72.525 7.29355 70.4 8.79354L17.275 49.2936"
//         strokeWidth="5"
//         className="hamburger__top-line"
//       />
//       <path
//         d="M16 68.7936H81.875C81.875 72.6269 81.875 81.2936 81.875 83.2936C81.875 88.7936 80.175 90.6269 79.325 91.2936C76.265 93.6936 72.525 92.2936 70.4 90.7936L17.275 50.2936"
//         strokeWidth="5"
//         className="hamburger__bottom-line"
//       />
//     </svg>
//   );
// }

function HamburgerIcon() {
  return (
    <div className="hamburger-icon flex h-full w-full flex-col items-center justify-center"></div>
  );
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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
    <div className="flex items-center justify-between px-6 py-2 sm:py-3 md:hidden">
      <Image
        src={Logo}
        className="z-30 aspect-square w-14 object-contain"
        alt="Modern Engineers (India) Logo"
        priority
        quality={80}
      />
      {/* FIXME: Change the Icon */}
      <Button
        variant="outline"
        size="icon"
        className="hamburger-btn group z-30 h-8 w-8 rounded-lg p-1 sm:h-10 sm:w-10"
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
        } fixed left-0 right-0 top-0 z-10 min-h-screen overflow-y-auto bg-background px-6 py-24`}
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
