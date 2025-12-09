"use client";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { MobileSidebar } from "./MobileSidebar";
import { UserNav } from "./UserNav";
import Notification from "./Notification";
import Logo from "../public/assets/logo.png";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 py-1">
      <nav className="h-14 flex items-center justify-between px-4 ">
        <div className="hidden lg:block">
          <Link
            aria-current="page"
            className="flex items-center gap-1 bg-white/90  rounded-full hover:bg-white/100 transition-colors "
            href="/dashboard"
          >
            <Image
              src={Logo}
              alt="The_LOGO"
              width={100}
              height={100}
              className=" h-12 w-12 roundedfull "
              priority
            />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-3">
          <Notification />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
