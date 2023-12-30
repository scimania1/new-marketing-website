import { SearchBar } from "@/components/ui/search-bar";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants";
import {
  getAllProducts,
  getAllProductsCount,
  getFilteredProducts,
  getFilteredProductsCount,
} from "@/lib/data";
import { range, wait } from "@/lib/utils";
import Pagination from "@/components/ui/pagination";
import { Suspense } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ui/product-card";
import FilterCategories from "@/components/filter-categories";
import ClearFiltersButton from "@/components/clear-filters-button";
import { SearchParams } from "@/lib/types";

async function Cards({ page, limit, query, categories }: SearchParams) {
  if (query.length === 0) {
    const products = await getAllProducts(page, limit, categories);
    return (
      <>
        {products.products.map((product) => (
          <ProductCard key={product.name + product.imageURL} {...product} />
        ))}
      </>
    );
  } else {
    const products = await getFilteredProducts(page, limit, query, categories);
    return (
      <>
        {products.map((product) => (
          <ProductCard key={product.name + product.imageURL} {...product} />
        ))}
      </>
    );
  }
}

async function Paginate({ page, limit, query, categories }: SearchParams) {
  if (query.length === 0) {
    const count = await getAllProductsCount(categories);
    const totalPages = Math.ceil(count / limit);
    return (
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        showControls={true}
      />
    );
  } else {
    const products = await getFilteredProductsCount(query, categories);
    const totalPages =
      products &&
      (products.length === 0 ? 1 : Math.ceil(products[0].count.total / limit));
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages || 1}
        showControls={true}
      />
    );
  }
}

function CardLoadingSkeleton({ limit }: { limit: number }) {
  const arr = range(1, limit);
  return (
    <>
      {arr.map((_, idx) => (
        <Skeleton key={idx} className="h-44" />
      ))}
    </>
  );
}

// TODO: make the page number loading skeleton
function PageLoadingSkeleton() {
  return <></>;
}

function MainContainer(searchParams: SearchParams) {
  const { page, query, limit, categories } = searchParams;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:items-center md:justify-center lg:grid-cols-[1fr_1fr]">
        <SearchBar placeholder="Search Products..." />
        <div className="justify-self-center lg:justify-self-end">
          <Suspense
            key={query + "-paginate"}
            fallback={<h1>Page Numbers are Loading</h1>}
          >
            <Paginate {...{ page, limit, query, categories }} />
          </Suspense>
        </div>
      </div>
      <div className="grid auto-rows-max grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 md:py-8 lg:gap-8 xl:grid-cols-3">
        {/* <div className="grid grid-cols-1 gap-4 py-4 md:gap-6 lg:gap-8 xl:grid-cols-3"> */}
        <Suspense
          key={query + categories + `${page}` + "-cards"}
          fallback={<CardLoadingSkeleton limit={limit} />}
        >
          <Cards {...{ page, limit, query, categories }} />
        </Suspense>
      </div>
    </>
  );
}

export default function Products({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    query?: string;
    categories?: string | string[];
  };
}) {
  const page =
    typeof searchParams.page === "string"
      ? parseInt(searchParams.page || "") || DEFAULT_PAGE
      : DEFAULT_PAGE;
  const limit =
    typeof searchParams.limit === "string"
      ? parseInt(searchParams.limit || "") || DEFAULT_LIMIT
      : DEFAULT_LIMIT;
  const query =
    typeof searchParams.query === "string" ? searchParams.query : "";
  let categories: string[];
  if (typeof searchParams.categories === "string") {
    categories =
      searchParams.categories.length > 0 ? [searchParams.categories] : [];
  } else if (Array.isArray(searchParams.categories)) {
    categories = searchParams.categories;
  } else {
    categories = [];
  }
  return (
    // <div className="relative grid items-start gap-4 px-6 py-4 sm:px-8 md:grid-cols-[1fr_3fr] md:px-12 lg:grid-cols-[1fr_4fr] lg:px-20 lg:py-8">
    <div className="relative grid items-start gap-4 px-6 py-4 sm:px-8 md:px-12 lg:grid-cols-[1fr_3fr] lg:gap-8 lg:px-20 lg:py-8 xl:grid-cols-[1fr_4fr]">
      <aside className="">
        <Suspense
          key={categories + query + "-tag"}
          fallback={<h1>Loading Filter Component</h1>}
        >
          <div className="">
            <FilterCategories selectedCategories={categories} />
          </div>
        </Suspense>
      </aside>
      <section>
        <MainContainer {...{ page, limit, query, categories }} />
      </section>
    </div>
  );
}

// export default function Products({
//   searchParams,
// }: {
//   searchParams: {
//     page?: string;
//     limit?: string;
//     query?: string;
//     categories?: string | string[];
//   };
// }) {
//   const page =
//     typeof searchParams.page === "string"
//       ? parseInt(searchParams.page || "") || DEFAULT_PAGE
//       : DEFAULT_PAGE;
//   const limit =
//     typeof searchParams.limit === "string"
//       ? parseInt(searchParams.limit || "") || DEFAULT_LIMIT
//       : DEFAULT_LIMIT;
//   const query =
//     typeof searchParams.query === "string" ? searchParams.query : "";
//   let categories: string[];
//   if (typeof searchParams.categories === "string") {
//     categories =
//       searchParams.categories.length > 0 ? [searchParams.categories] : [];
//   } else if (Array.isArray(searchParams.categories)) {
//     categories = searchParams.categories;
//   } else {
//     categories = [];
//   }
//   return (
//     // <div className="relative grid items-start gap-4 px-6 py-4 sm:px-8 md:grid-cols-[1fr_3fr] md:px-12 lg:grid-cols-[1fr_4fr] lg:px-20 lg:py-8">
//     <div className="relative grid items-start gap-4 px-6 py-4 sm:px-8 md:px-12 lg:grid-cols-[1fr_3fr] lg:gap-8 lg:px-20 lg:py-8 xl:grid-cols-[1fr_4fr]">
//       <aside className="">
//         <Suspense
//           key={categories + query + "-tag"}
//           fallback={<h1>Loading Filter Component</h1>}
//         >
//           <div className="">
//             <FilterCategories selectedCategories={categories} />
//           </div>
//         </Suspense>
//       </aside>
//       <section>
//         <div className="grid grid-cols-1 gap-4 md:items-center md:justify-center lg:grid-cols-[1fr_1fr]">
//           <SearchBar placeholder="Search Products..." />
//           <div className="justify-self-center lg:justify-self-end">
//             <Suspense
//               key={query + "-paginate"}
//               fallback={<h1>Page Numbers are Loading</h1>}
//             >
//               <Paginate {...{ page, limit, query, categories }} />
//             </Suspense>
//           </div>
//         </div>
//         <div className="grid auto-rows-max grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 md:py-8 lg:gap-8 xl:grid-cols-3">
//           {/* <div className="grid grid-cols-1 gap-4 py-4 md:gap-6 lg:gap-8 xl:grid-cols-3"> */}
//           <Suspense
//             key={query + categories + `${page}` + "-cards"}
//             fallback={<CardLoadingSkeleton limit={limit} />}
//           >
//             <Cards {...{ page, limit, query, categories }} />
//           </Suspense>
//         </div>
//       </section>
//     </div>
//   );
// }
