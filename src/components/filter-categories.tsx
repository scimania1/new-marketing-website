import { getTags } from "@/lib/data";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import SearchFormCategories from "./search-form-categories";
import { playfairDisplay } from "@/app/fonts";
import { Separator } from "./ui/separator";
import ClearFiltersButton from "./clear-filters-button";

export default async function FilterCategories({
  selectedCategories,
}: {
  selectedCategories: string[];
}) {
  const categories = await getTags();

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="gap-2" variant="outline">
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-3">
            <SearchFormCategories
              categories={categories}
              initialSelectedCategories={selectedCategories}
            >
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="default" type="submit">
                    Apply
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </SearchFormCategories>
          </DrawerContent>
        </Drawer>
        {selectedCategories.length > 0 ? <ClearFiltersButton /> : null}
      </div>
      <div className="hidden space-y-4 lg:block">
        <h2 className={`text-2xl tracking-wide ${playfairDisplay.className}`}>
          Filters
        </h2>
        <Separator orientation="horizontal" />
        <SearchFormCategories
          categories={categories}
          initialSelectedCategories={selectedCategories}
        >
          <Button variant="default" type="submit">
            Apply
          </Button>
        </SearchFormCategories>
      </div>
    </>
  );
}
