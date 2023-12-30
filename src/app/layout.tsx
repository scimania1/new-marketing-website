import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { chivo, comfortaa, openSans } from "./fonts";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

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
          "relative min-h-screen bg-background font-sans antialiased",
          comfortaa.className,
        )}
      >
        <Navbar />
        <main className="relative flex min-h-screen flex-col">
          <div className="flex-1 flex-grow">{children}</div>
        </main>
        <Footer />
        {/*Footer here*/}
      </body>
    </html>
  );
}
