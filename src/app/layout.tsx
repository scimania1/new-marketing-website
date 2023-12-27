import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { openSans } from "./fonts";
import Navbar from "@/components/ui/navbar";

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
    <html lang="en">
      <body
        className={cn(
          "relative antialiased font-sans min-h-screen bg-background",
          openSans.className,
        )}
      >
        {/*Navbar here*/}
        <Navbar />
        <main className="flex flex-col relative">
          <div className="flex-grow flex-1">{children}</div>
        </main>
        {/*Footer here*/}
      </body>
    </html>
  );
}
