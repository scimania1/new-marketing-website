"use client";

import Image from "next/image";
import Logo from "@/assets/MEI Logo.png";
import navigationLinks from "./links";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function MainNav() {
  return (
    <div className="hidden items-center gap-4 px-8 py-2 md:flex lg:gap-6">
      <picture className="mr-auto">
        <Image
          src={Logo}
          className="z-30 aspect-square w-14 object-contain"
          alt="Modern Engineers (India) Logo"
          priority
          quality={80}
        />
      </picture>
      <NavigationLinksDesktop />
    </div>
  );
}

export function NavigationLinksDesktop() {
  const currentPath = usePathname();
  const filteredIdx = navigationLinks.findIndex(
    (link) => link.url === currentPath,
  );
  const [selectedIdx, setSelectedIdx] = useState(filteredIdx);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  return (
    <ul
      className="text-md hidden items-center text-slate-500 md:flex md:gap-5 lg:text-lg"
      onMouseLeave={() => setFocusedIdx(null)}
      aria-label="primary navigation links"
    >
      {navigationLinks.map((link, idx) => (
        <li key={link.url} className="relative z-10">
          <Link
            href={link.url}
            className={`rounded-md p-2 outline-offset-[6px] outline-ring transition-all duration-500 ease-in-out hover:text-slate-800 focus:text-slate-800 ${
              selectedIdx === idx ? "text-slate-800" : ""
            }`}
            onClick={() => setSelectedIdx(idx)}
            onFocus={() => setFocusedIdx(idx)}
            onMouseEnter={() => setFocusedIdx(idx)}
            onKeyDown={(e) => (e.key === "Enter" ? setSelectedIdx(idx) : null)}
          >
            {idx === selectedIdx && (
              <span className="sr-only">Active Page Link</span>
            )}
            {link.name}
          </Link>
          {focusedIdx === idx && (
            <motion.div
              layoutId="bg-hover"
              className="absolute inset-[-3px] z-[-10] rounded-lg bg-slate-200/60 md:inset-[-7px]"
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
            />
          )}
          {selectedIdx === idx && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-[-24px] left-[-5px] right-[-5px] h-[2px] rounded-sm bg-blue-500"
              transition={{
                duration: 0.3,
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
