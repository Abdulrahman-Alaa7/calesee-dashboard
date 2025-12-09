"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { NavItem } from "../constants/data";
import { Dispatch, SetStateAction } from "react";
import {
  Combine,
  LayoutDashboard,
  Logs,
  Settings,
  ShoppingCart,
  Palette,
  Ruler,
  PlaneLanding,
  Bot,
} from "lucide-react";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  const iconMap: any = {
    LayoutDashboard: LayoutDashboard,
    Logs: Logs,
    ShoppingCart: ShoppingCart,
    Combine: Combine,
    Settings: Settings,
    Colors: Palette,
    Sizes: Ruler,
    landing: PlaneLanding,
    seo: Bot,
  };

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />

                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
