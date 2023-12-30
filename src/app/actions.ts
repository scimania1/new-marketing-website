"use server";

import { createUrl } from "@/lib/utils";
import { ReadonlyURLSearchParams, redirect } from "next/navigation";

export async function applyFilters(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  selectedCategories: Set<string>,
  _: FormData,
) {
  const params = new URLSearchParams(searchParams);
  params.set("page", "1");
  params.delete("categories");
  selectedCategories.forEach((val) => {
    params.append("categories", val);
  });
  redirect(createUrl("/products", params));
}

// export async function clearFilters(searchParams: SearchParams) {
//   const { page, limit, query } = searchParams;
//   const params = new URLSearchParams();
//   if (page !== DEFAULT_PAGE) {
//     params.set("page", `${page}`);
//   }
//   if (limit !== DEFAULT_LIMIT) {
//     params.set("limit", `${limit}`);
//   }
//   if (query.length) {
//     params.set("query", query);
//   }
//   redirect(createUrl("/products", params));
// }
