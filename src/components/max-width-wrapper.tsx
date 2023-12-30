import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-2.5 sm:px-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
