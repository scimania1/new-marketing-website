// TODO: MAKE THIS A PROPER RE-USABLE COMPONENT

"use client";
import { cn, createUrl } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export enum PaginationItem {
  DOTS = "dots",
  NEXT = "next",
  PREV = "prev",
}

export type PaginationItemValue = number | PaginationItem;

export type PaginationProps = {
  /**
   * The total number of pages
   */
  totalPages: number;
  /**
   * The active page
   */
  currentPage: number;
  /**
   * The number of pages to show on each side of the current page
   * @default 1
   */
  siblings?: number;
  /**
   * The number of pages to be shown at the beginning and the end of pagination
   * @default 1
   */
  boundaries?: number;
  /**
   * If `true`, show the "prev" and "next" buttons
   * @default false
   */
  showControls?: boolean;
};

function range(start: number, end: number, step: number = 1) {
  return Array.from(
    { length: (end - start) / step + 1 },
    (_, num) => start + num * step,
  );
}

function getRange(
  totalPages: number,
  currentPage: number,
  siblings: number,
  boundaries: number,
): PaginationItemValue[] {
  /** lets say we are in the middle of the array, then there is
   * 1 middle guy + siblings on either side (2 * siblings) +
   * boundary elements on either side (2 * boundaries) + 2 dots
   */
  const arraySize = siblings * 2 + boundaries * 2 + 3;
  if (arraySize >= totalPages) {
    return range(1, totalPages);
  }
  const leftSiblingIdx = Math.max(currentPage - siblings, boundaries);
  const rightSiblingIdx = Math.min(
    currentPage + siblings,
    totalPages - boundaries + 1,
  );
  const leftDotsVisible = leftSiblingIdx > boundaries + 2;
  const rightDotsVisible = totalPages - boundaries + 1 - rightSiblingIdx > 2;

  if (leftDotsVisible && !rightDotsVisible) {
    const rightCount = arraySize - boundaries - 1;
    return [
      ...range(1, boundaries),
      PaginationItem.DOTS,
      ...range(rightCount, totalPages),
    ];
  }

  if (!leftDotsVisible && rightDotsVisible) {
    const leftCount = arraySize - boundaries - 1;
    return [
      ...range(1, leftCount),
      PaginationItem.DOTS,
      ...range(totalPages - boundaries + 1, totalPages),
    ];
  }

  return [
    ...range(1, boundaries),
    PaginationItem.DOTS,
    ...range(leftSiblingIdx, rightSiblingIdx),
    PaginationItem.DOTS,
    ...range(totalPages - boundaries + 1, totalPages),
  ];
}

function PaginateButton({
  paginationItemValue,
  currentPage,
  totalPages,
  idx,
  boundaries,
  showControls,
  length,
}: {
  paginationItemValue: PaginationItemValue;
  currentPage: number;
  totalPages: number;
  idx: number;
  boundaries: number;
  showControls: boolean;
  length: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const handlePrevClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage - 1}`);
    router.push(createUrl(pathname, params));
  };
  const handleNextClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage + 1}`);
    router.push(createUrl(pathname, params));
  };
  const handlePageClick = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    router.push(createUrl(pathname, params));
  };
  const handleDotsLeft = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage - Math.floor(totalPages / 2)}`);
    router.push(createUrl(pathname, params));
  };
  const handleDotsRight = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage + Math.floor(totalPages / 2)}`);
    router.push(createUrl(pathname, params));
  };
  if (paginationItemValue === PaginationItem.PREV) {
    const isDisabled = currentPage === 1;
    return (
      <li
        role="button"
        aria-label="previous page button"
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handlePrevClick}
        className={`flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9${
          isDisabled ? " pointer-events-none" : ""
        }`}
      >
        <ChevronLeft
          className={cn("stroke-slate-700", isDisabled && "stroke-slate-300")}
        />
      </li>
    );
  }
  if (paginationItemValue === PaginationItem.NEXT) {
    const isDisabled = currentPage === totalPages;
    return (
      <li
        role="button"
        aria-label="next page button"
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleNextClick}
        className={`flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9${
          isDisabled ? " pointer-events-none" : ""
        }`}
      >
        <ChevronRight
          className={cn("stroke-slate-700", isDisabled && "stroke-slate-300")}
        />
      </li>
    );
  }
  if (paginationItemValue === PaginationItem.DOTS) {
    if (idx - boundaries === Number(showControls)) {
      return (
        <li
          role="button"
          aria-label="skip ahead"
          className="group flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 transition-colors duration-300 hover:bg-slate-300 sm:h-9 sm:w-9"
          onClick={handleDotsLeft}
          tabIndex={0}
        >
          <MoreHorizontal className="stroke-slate-700 group-hover:hidden" />
          <ChevronsLeft className="hidden stroke-slate-700 group-hover:block" />
        </li>
      );
    } else {
      return (
        <li
          role="button"
          aria-label="skip ahead"
          onClick={handleDotsRight}
          className="group flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 transition-colors duration-300 hover:bg-slate-300 sm:h-9 sm:w-9"
          tabIndex={0}
        >
          <MoreHorizontal className="stroke-slate-700 group-hover:hidden" />
          {idx - boundaries === Number(showControls) && (
            <ChevronsLeft className="hidden stroke-slate-700 group-hover:block" />
          )}
          {idx + boundaries === length - Number(showControls) - 1 && (
            <ChevronsRight className="hidden stroke-slate-700 group-hover:block" />
          )}
        </li>
      );
    }
  }
  return (
    <li
      role="button"
      aria-label={`go to page ${paginationItemValue}`}
      onClick={() => handlePageClick(paginationItemValue)}
      tabIndex={0}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-300 sm:h-9 sm:w-9 ${
        paginationItemValue === currentPage
          ? "bg-primary text-white"
          : "bg-slate-200 hover:bg-slate-300"
      }`}
    >
      {paginationItemValue}
    </li>
  );
}

// this function needs to return the paginationArray
export default function Pagination(props: PaginationProps) {
  // so let the total number of pages to be displayed be 8
  const {
    totalPages,
    currentPage,
    siblings = 1,
    boundaries = 1,
    showControls = true,
  } = props;
  let arr = getRange(totalPages, currentPage, siblings, boundaries);
  if (showControls) {
    arr = [PaginationItem.PREV, ...arr, PaginationItem.NEXT];
  }
  const currentPageIdx = arr.findIndex((val) => val === currentPage);
  // rendering logic
  return (
    <ul className="flex list-none gap-1 text-xs sm:text-sm">
      {arr.map((val, idx) => (
        <PaginateButton
          key={idx}
          showControls={showControls}
          paginationItemValue={val}
          currentPage={currentPage}
          totalPages={totalPages}
          idx={idx}
          boundaries={boundaries}
          length={arr.length}
        />
      ))}
    </ul>
  );
}
