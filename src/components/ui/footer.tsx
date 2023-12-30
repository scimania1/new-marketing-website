import Image from "next/image";
import MaxWidthWrapper from "../max-width-wrapper";
import { playfairDisplay } from "@/app/fonts";
import { Separator } from "./separator";

export default function Footer() {
  return (
    <div className="border border-t-secondary bg-background/75">
      <MaxWidthWrapper className="grid py-8">
        <div className="grid place-items-center">
          <span
            className={`pb-4 text-muted-foreground ${playfairDisplay.className}`}
          >
            Our Brands
          </span>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/GouravDLXLogo.png"
              alt="Gourav DLX Logo"
              width={80}
              height={80}
              className="w-20"
            />
            <Image
              src="/Logo.png"
              alt="Modern Engineers (India) Logo"
              width={80}
              height={80}
              className="w-14"
            />
          </div>
          <h1
            className={`${playfairDisplay.className} py-4 text-center text-xl font-medium tracking-wide text-muted-foreground`}
          >
            Modern Engineers (India)
          </h1>
        </div>
        <div className="flex px-12">
          <Separator orientation="vertical" className="hidden" />
          <Separator orientation="horizontal" className="md:hidden" />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
