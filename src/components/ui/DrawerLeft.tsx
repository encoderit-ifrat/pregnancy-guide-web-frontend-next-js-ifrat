"use client";
import IconHamburgerMenu from "@/assets/IconHamburgerMenu";
import IconLogin from "@/assets/IconLogin";
import Logo from "@/assets/Logo";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { X, ChevronRight, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpandableSearchBar from "../base/ExpandableSearchBar";
interface DrawerLeftProps {
  links: { href: string; label: string }[];
}
export default function DrawerLeft({ links }: DrawerLeftProps) {
  const [open, setOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      {/* Hamburger icon trigger for mobile */}
      <DrawerTrigger asChild>
        <button
          className="md:hidden p-2.5 rounded-xl hover:text-white  hover:bg-primary  dark:hover:bg-primary transition-all duration-200 active:scale-95"
          aria-label="Open menu"
        >
          <IconHamburgerMenu className="" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-[280px] border-r-0 shadow-2xl">
        <div className="h-full flex flex-col  from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          {/* Close button with modern styling */}
          <DrawerClose asChild>
            <button
              className="absolute top-3 right-5 p-2 rounded-full text-text-dark hover:text-text-light dark:hover:bg-primary  transition-all duration-200 z-10 active:scale-95"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>
          {/* Header with gradient accent */}
          <DrawerHeader className="pb-2 px-6 border-b border-gray">
            <div className="flex items-center">
              {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br bg-primary flex items-center justify-center shadow-lg">
                <Menu className="w-5 h-5 text-white" />
              </div> */}
              <Link href="/" className="w-20 md:w-24 h-12 p-1 shrink-0">
                <Logo />
              </Link>
              <div>
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </div>
            </div>
            <ExpandableSearchBar
              isExpanded={isSearchExpanded}
              // onExpandChange={setIsSearchExpanded}
            />
          </DrawerHeader>
          {/* Navigation links with hover effects */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-text-dark  hover:text-text-light  dark:hover:bg-primary transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </nav>
          <div className="flex flex-col items-center gap-2 px-4 pb-6">
            {isLoggedIn ? (
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="default"
                size="sm"
                className="w-full text-sm gap-1"
              >
                <LogOut />
                Logga Ut
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                variant="default"
                size="sm"
                className="w-full text-sm gap-1"
              >
                <IconLogin />
                Logga In
              </Button>
            )}
          </div>
          {/* Footer with gradient */}
          <div className="p-4 border-t border-gray">
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              Copyright © 2025{" "}
              <span className="text-secondary">Familj.se.</span> All Right
              Reserved.
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
