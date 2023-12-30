import { type ClassValue, clsx } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUrl(
  pathname: string,
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) {
  const paramsString = searchParams.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
}

export function range(start: number, end: number, step: number = 1) {
  return Array.from(
    { length: (end - start) / step + 1 },
    (_, num) => start + num * step,
  );
}

export function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
