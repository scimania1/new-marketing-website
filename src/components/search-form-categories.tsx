"use client";

import * as React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { applyFilters } from "@/app/actions";
import MaxWidthWrapper from "./max-width-wrapper";

export default function SearchFormCategories({
  categories,
  initialSelectedCategories = [],
  children,
}: {
  categories: string[];
  initialSelectedCategories?: string[];
  children: React.ReactNode;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<
    Set<string>
  >(new Set(initialSelectedCategories));
  const searchParams = useSearchParams();
  const filteredCategories = categories.filter(
    (category) =>
      category.length > 0 &&
      category.toLowerCase().includes(query.toLowerCase()),
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const clearInput = () => {
    setQuery("");
    inputRef.current && inputRef.current.focus();
  };
  const applyFiltersWithSearchParams = applyFilters.bind(
    null,
    searchParams,
    selectedCategories,
  );
  return (
    <form action={applyFiltersWithSearchParams}>
      <MaxWidthWrapper className="max-w-lg space-y-4 lg:px-0">
        <div className="relative mt-2 flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-7 w-full px-3 pl-2 pr-6 text-xs outline-none placeholder:text-muted-foreground sm:text-sm"
            placeholder="Find Filters ..."
            autoComplete="off"
            role="search"
            id="filter-products"
            ref={inputRef}
          />
          {query.length > 0 && (
            <XCircle
              size={28}
              className="focus-visible:ring-offset absolute right-2 rounded-full fill-slate-400 stroke-background p-1 ring-offset-background transition-colors duration-200 ease-out focus-within:fill-slate-700 hover:fill-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-foreground focus-visible:ring-offset-1"
              role="button"
              aria-label="clear search button"
              tabIndex={0}
              onClick={clearInput}
            />
          )}
        </div>
        <ScrollArea
          type="auto"
          className="mt-3 h-[300px] px-4 text-sm lg:mt-0 lg:h-[600px] lg:px-0"
        >
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {filteredCategories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={category.toLowerCase()}
                  name={category.toLowerCase()}
                  checked={
                    selectedCategories.has(category.toLowerCase())
                      ? true
                      : undefined
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const newSet = new Set(selectedCategories);
                      newSet.add(category.toLowerCase());
                      setSelectedCategories(newSet);
                    } else {
                      const newSet = new Set(selectedCategories);
                      newSet.delete(category.toLowerCase());
                      setSelectedCategories(newSet);
                    }
                  }}
                />
                <Label
                  htmlFor={category.toLowerCase()}
                  className="py-1 text-sm"
                >
                  {category[0].toUpperCase() + category.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        {children}
      </MaxWidthWrapper>
    </form>
  );
}

// export default function SearchFormCategories({
//   categories,
// }: {
//   categories: string[];
// }) {
//   const [query, setQuery] = React.useState("");
//   // make a state of set that contains the idx as the value
//   const filteredCategoryIdxsMapRef = React.useRef<Set<number>>(new Set());
//   categories.forEach((category, idx) => {
//     if (category.toLowerCase().includes(query.toLowerCase())) {
//       filteredCategoryIdxsMapRef.current.add(idx);
//     } else {
//       filteredCategoryIdxsMapRef.current.delete(idx);
//     }
//   });
//   const getStyle = (idx: number) =>
//     filteredCategoryIdxsMapRef.current.has(idx) ? "block" : "hidden";
//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <div className="grid grid-cols-2 gap-2">
//         {categories.map((category, idx) => (
//           <div key={idx} className={`flex gap-2 ${getStyle(idx)}`}>
//             <input
//               type="checkbox"
//               id={category.toLowerCase()}
//               name={category.toLowerCase()}
//             />
//             <label htmlFor={category.toLowerCase()}>{category}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// BACKUP JUST IN CASE
// export default function SearchFormCategories({
//   categories,
//   selectedCategories = [],
// }: {
//   categories: string[];
//   selectedCategories?: string[];
// }) {
//   const [query, setQuery] = React.useState("");
//   // make a state of set that contains the idx as the value
//   const checkedSet = React.useRef<Set<string>>(new Set(selectedCategories));
//   const filteredCategories = categories.filter(
//     (category) =>
//       category.length > 0 &&
//       category.toLowerCase().includes(query.toLowerCase()),
//   );
//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const clearInput = () => {
//     setQuery("");
//     inputRef.current && inputRef.current.focus();
//   };
//   return (
//     <div>
//       <div className="relative mt-2 flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//         <input
//           type="search"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="h-7 w-full px-3 pl-2 pr-6 text-xs outline-none placeholder:text-muted-foreground sm:text-sm"
//           placeholder="Find Filters ..."
//           autoComplete="off"
//           role="search"
//           id="filter-products"
//           ref={inputRef}
//         />
//         {query.length > 0 && (
//           <XCircle
//             size={28}
//             className="focus-visible:ring-offset absolute right-2 rounded-full fill-slate-400 stroke-background p-1 ring-offset-background transition-colors duration-200 ease-out focus-within:fill-slate-700 hover:fill-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-foreground focus-visible:ring-offset-1"
//             role="button"
//             aria-label="clear search button"
//             tabIndex={0}
//             onClick={clearInput}
//           />
//         )}
//       </div>
//       <ScrollArea className="mt-3 h-[300px] px-4 text-sm">
//         <div className="grid gap-2">
//           {filteredCategories.map((category, idx) => (
//             <div key={idx} className="flex gap-2">
//               {/* <input */}
//               {/*   type="checkbox" */}
//               {/*   id={category.toLowerCase()} */}
//               {/*   name={category.toLowerCase()} */}
//               {/*   checked={ */}
//               {/*     checkedSet.current.has(category.toLowerCase()) */}
//               {/*       ? true */}
//               {/*       : undefined */}
//               {/*   } */}
//               {/*   onChange={(e) => { */}
//               {/*     if (e.target.checked) { */}
//               {/*       checkedSet.current.add(category.toLowerCase()); */}
//               {/*     } else { */}
//               {/*       checkedSet.current.delete(category.toLowerCase()); */}
//               {/*     } */}
//               {/*   }} */}
//               {/* /> */}
//               <Checkbox
//                 id={category.toLowerCase()}
//                 name={category.toLowerCase()}
//                 checked={
//                   checkedSet.current.has(category.toLowerCase())
//                     ? true
//                     : undefined
//                 }
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     checkedSet.current.add(category.toLowerCase());
//                   } else {
//                     checkedSet.current.delete(category.toLowerCase());
//                   }
//                 }}
//               />
//               <Label htmlFor={category.toLowerCase()} className="text-sm">
//                 {category[0].toUpperCase() + category.slice(1)}
//               </Label>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }
