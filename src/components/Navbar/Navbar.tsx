"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import DrawerLeft from "../ui/DrawerLeft";
import IconDownload from "@/assets/IconDownload";
import IconLogin from "@/assets/IconLogin";
import Logo from "@/assets/Logo";
import { ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitial } from "@/app/profile/_component/profile";
import ExpandableSearchBar from "../base/ExpandableSearchBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryGetAllCategories } from "./api/queries/useQueryGetAllCategories";
export default function Navbar() {
  const [navigationLinks, setNavigationLinks] = useState<
    { href: string; label: string }[]
  >([]);
  const router = useRouter();
  const { data: categories, isLoading: isLoadingCategories } =
    useQueryGetAllCategories();

  useEffect(() => {
    if (categories?.data?.data.length > 0) {
      const data = categories.data.data;
      setNavigationLinks(
        data.map((category: any) => ({
          href: `/search-article?page=1&category=${category.slug}`,
          label: category.name,
        }))
      );
    }
  }, [categories]);

  const { user, isAuthenticated } = useCurrentUser();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  // 🚧
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // 🔥 NEW: Re-check scroll when navigation links change
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);
    return () => clearTimeout(timer);
  }, [navigationLinks, checkScroll]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="bg-white flex items-center justify-between rounded-full shadow-md max-w-5xl mx-auto px-4 h-16 transition-all duration-300">
        {/* Logo */}
        <Link
          href={isAuthenticated ? "/pregnancy-overview" : "/"}
          className="w-20 md:w-24 h-12 p-1 shrink-0"
        >
          <Logo />
        </Link>

        {/* Navigation — hidden when search expands */}
        <div
          className={`flex-1 flex justify-center overflow-hidden transition-all duration-300 ${
            isSearchExpanded
              ? "opacity-0 pointer-events-none scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="relative hidden md:block">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <ChevronLeft
                className="size-6 cursor-pointer bg-white absolute left-0 top-1/2 -translate-y-1/2 z-10"
                onClick={() => handleScroll("left")}
              />
            )}

            {/* Right Scroll Button */}
            {canScrollRight && (
              <ChevronRight
                className="size-6 cursor-pointer bg-white absolute right-0 top-1/2 -translate-y-1/2 z-10"
                onClick={() => handleScroll("right")}
              />
            )}

            {/* Scrollable Navigation Menu */}
            <NavigationMenu>
              <div
                ref={scrollRef}
                className="overflow-x-auto max-w-xl scrollbar-hide scroll-smooth "
              >
                <NavigationMenuList className="gap-2 xl:gap-4">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <Link
                        href={link.href}
                        className="text-[#141414] hover:text-primary py-2 px-2 lg:px-3 font-medium text-sm lg:text-base whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </div>
            </NavigationMenu>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Expandable Search Bar */}
          <div className="hidden md:block">
            <ExpandableSearchBar
              isExpanded={isSearchExpanded}
              onExpandChange={setIsSearchExpanded}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-1 lg:gap-2">
            {!isAuthenticated && (
              <Button
                variant="default"
                size="sm"
                className="text-xs lg:text-sm gap-1"
                onClick={() => router.push("/login")}
              >
                <IconLogin />
                <span className="hidden lg:inline">Logga In</span>
              </Button>
            )}
            <Button
              asChild
              variant="purple"
              size="sm"
              className="text-xs lg:text-sm gap-1"
            >
              <a href="#">
                <IconDownload />
                <span className="hidden lg:inline">Ladda Ner</span>
              </a>
            </Button>

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Avatar className="size-9">
                    {user?.avatar && (
                      <AvatarImage
                        src={user.avatar}
                        alt="profile image"
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary-gradient text-popover-foreground uppercase">
                      {getInitial(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="hover:bg-black/5">
                      <User className="mr-2 size-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/change-password">
                    <DropdownMenuItem className="hover:bg-black/5">
                      <User className="mr-2 size-4" />
                      Change Password
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="hover:bg-black/5"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 size-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Drawer */}
          <div className="md:hidden flex items-center gap-2">
            <DrawerLeft links={navigationLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
