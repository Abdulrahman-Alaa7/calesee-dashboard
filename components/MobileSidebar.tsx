"use client";
import { useState } from "react";
import { DashboardNav } from "./DashboardNav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { navItems } from "../constants/data";
import { MenuIcon } from "lucide-react";

export function MobileSidebar({}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          asChild
          className=" cursor-pointer hover:bg-muted p-2 rounded-full transition-all"
        >
          <MenuIcon size={40} />
        </SheetTrigger>
        <SheetContent className="px-0 pt-0 pb-12" side={`left`}>
          <SheetHeader className="">
            <SheetTitle> </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
