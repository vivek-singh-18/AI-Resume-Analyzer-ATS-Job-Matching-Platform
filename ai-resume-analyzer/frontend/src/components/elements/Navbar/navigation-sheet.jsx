import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import NavMenu from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      {/* Mobile menu trigger */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* Sheet content */}
      <SheetContent side="right" className="p-4 flex flex-col">
        {/* Custom header */}
        <div className="flex items-center justify-between ">
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>

          {/* Only close button */}
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>
        </div>
        <hr className="my-4" />

        {/* Navigation items */}
        <NavMenu orientation="vertical" className="flex-1 -top-50" />
      </SheetContent>
    </Sheet>
  );
};
