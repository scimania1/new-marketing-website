import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { openSans } from "./fonts";

export const metadata: Metadata = {
  title: "Modern Engineers (India)",
  description: "The standard for Agricultural Implement Parts and Equipment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "relative antialiased font-sans h-full",
          openSans.className,
        )}
      >
        {/*Navbar here*/}
        <main className="flex flex-col relative min-h-screen">
          <div className="flex-grow flex-1">{children}</div>
        </main>
        {/*Footer here*/}
      </body>
    </html>
  );
}
