"use client";

import { createUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function ClearFiltersButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categories");
    router.push(createUrl("/products", params));
  };
  return (
    <Button variant="destructive" onClick={handleClick} className="gap-1">
      <X size={20} className="stroke-background" /> <span>Clear Filters</span>
    </Button>
  );
}
