"use client";

import * as React from "react";
import { cn, createUrl } from "@/lib/utils";
import { Search, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/use-debounce";

export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isClearable?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, placeholder, isClearable = true, ...props }, ref) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [inputValue, setInputValue] = React.useState(
      searchParams.get("query") || "",
    );
    const debouncedInputValue = useDebounce(inputValue, 300);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const clearInput = () => {
      setInputValue("");
      inputRef.current && inputRef.current.focus();
    };
    const prevQuery = React.useRef(searchParams.get("query") || "");

    React.useEffect(() => {
      const params = new URLSearchParams(searchParams);
      if (debouncedInputValue.length) {
        params.set("query", debouncedInputValue);
      } else {
        params.delete("query");
      }
      if (debouncedInputValue !== prevQuery.current) {
        params.set("page", "1");
        prevQuery.current = debouncedInputValue;
      }
      router.push(createUrl(pathname, params));
    }, [debouncedInputValue, searchParams, router, pathname]);

    return (
      <div
        className={cn(
          "group relative flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        aria-label="search-box"
        ref={ref}
      >
        <Search className="stroke-slate-400 transition-colors duration-200 ease-out group-focus-within:stroke-slate-600" />
        <input
          role="search"
          id="search"
          type="search"
          className="text-md h-10 w-full px-3 pl-2 pr-10 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          ref={inputRef}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
          {...props}
        />
        {isClearable && inputValue.length > 0 && (
          <XCircle
            size={28}
            className="focus-visible:ring-offset absolute right-5 rounded-full fill-slate-400 stroke-background p-1 ring-offset-background transition-colors duration-200 ease-out focus-within:fill-slate-700 hover:fill-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-foreground focus-visible:ring-offset-1"
            role="button"
            aria-label="clear search button"
            tabIndex={0}
            onClick={clearInput}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                clearInput();
              }
            }}
          />
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
