"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { NavigationLink } from "@/components/Navbar/_types/navbar_types";
import { useQueryGetAllCategories } from "@/components/Navbar/api/queries/useQueryGetAllCategories";
import { Category } from "@/types/shared";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ExpandableSearchBar from "@/components/base/ExpandableSearchBar";
import { ProfileDropDown } from "./ProfileDropDown";
import { signOut } from "next-auth/react";

export function Header() {
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
  const router = useRouter();
  const { data: categories } = useQueryGetAllCategories();

  useEffect(() => {
    if (
      categories?.data?.data &&
      Array.isArray(categories.data.data) &&
      categories.data.data.length > 0
    ) {
      const categoryData = categories.data.data as Category[];
      setNavigationLinks(
        categoryData.map((category) => ({
          href: `/search-article?page=1&category=${category.slug}`,
          label: category.name,
        }))
      );
    }
  }, [categories]);

  const { isAuthenticated } = useCurrentUser();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Sticky + visibility (slide) state
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Detect small screens (Tailwind's md breakpoint = 768px). On screens < md we always show the dark logo.
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Refs to store original body styles so we can restore them
  const bodyOverflowRef = useRef<string | null>(null);
  const bodyPaddingRightRef = useRef<string | null>(null);

  useEffect(() => {
    // Update header height on mount, on resize and when sticky state changes (header height changes between states)
    const updateHeaderHeight = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [isSticky]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const current = window.scrollY || 0;
      const willStick = current > 400;

      // Update sticky state
      setIsSticky(willStick);

      // Only apply slide behavior when sticky
      if (willStick) {
        if (current > lastScrollY.current && current > 100) {
          // Scrolling down -> hide
          setIsVisible(false);
        } else {
          // Scrolling up -> show
          setIsVisible(true);
        }
      } else {
        // Not sticky -> always visible
        setIsVisible(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Tailwind md breakpoint is 768px -> use max-width: 767px to represent < md
    const mql = window.matchMedia("(max-width: 1024px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsSmallScreen((e as any).matches);
    // initial
    setIsSmallScreen(mql.matches);
    // add listener (with backward-compatible API)
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange as EventListener);
    } else {
      // older Safari
      mql.addListener(onChange as unknown as EventListener);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange as EventListener);
      } else {
        mql.removeListener(onChange as unknown as EventListener);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isMenuOpen) {
      // save original body overflow and paddingRight
      bodyOverflowRef.current = document.body.style.overflow ?? "";
      bodyPaddingRightRef.current = document.body.style.paddingRight ?? "";

      // calculate scrollbar width to avoid layout shift when hiding scrollbar
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // disable scroll and hide scrollbar
      document.body.style.overflow = "hidden";
    } else if (bodyOverflowRef.current !== null) {
      // restore original styles
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.paddingRight = bodyPaddingRightRef.current ?? "";
      bodyOverflowRef.current = null;
      bodyPaddingRightRef.current = null;
    }

    // cleanup on unmount
    return () => {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        document.body.style.paddingRight = bodyPaddingRightRef.current ?? "";
        bodyOverflowRef.current = null;
        bodyPaddingRightRef.current = null;
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const logoClassName = `h-32 p-4 rounded-b-full flex items-center ${
    isSticky ? "" : "lg:bg-primary"
  }`;

  // Choose logo source: on small screens always use dark logo; otherwise dark when sticky, light when not.
  const logoSrc = isSmallScreen
    ? "/images/logo/logo-dark.png"
    : isSticky
      ? "/images/logo/logo-dark.png"
      : "/images/logo/logo-light.png";
  // [#F6F0FF]
  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "w-full z-50 transition-transform duration-300 ease-in-out bg-purple-soft",
          isSticky
            ? "fixed top-0 left-0 right-0 backdrop-blur-md shadow-2xl shadow-primary/50"
            : "relative",
          isSticky && !isVisible ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "container-xl flex items-center justify-between",
            isSticky ? "h-20" : "h-28 lg:h-20"
          )}
        >
          <div className="flex items-center gap-4 md:gap-14">
            {/* Logo */}
            <div className={logoClassName}>
              <Link
                href={isAuthenticated ? "/pregnancy-overview" : "/"}
                className="shrink-0"
              >
                <Image
                  src={logoSrc}
                  alt="Familj"
                  width={60}
                  height={30}
                  className="h-10 w-auto md:h-10"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className={cn(
                "hidden items-center gap-7 lg:flex transition-opacity duration-300",
                isSearchExpanded
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              )}
            >
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      `text-lg font-medium transition-colors text-primary-dark font-outfit`,
                      {
                        "text-primary font-semibold": isActive,
                      }
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <ExpandableSearchBar
                  isExpanded={isSearchExpanded}
                  onExpandChange={setIsSearchExpanded}
                />
                <div className="h-6 w-0.5 bg-primary" />
              </div>
              {isAuthenticated ? (
                <ProfileDropDown />
              ) : (
                <Link href="/login" className="hidden lg:block">
                  <Button className="font-poppins h-11.75 max-w-36.5 font-semibold text-lg text-white py-2.5 px-8.75">
                    Logga In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden bg-[#EEE4FD] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-8 w-8 text-primary-dark" />
              ) : (
                // <Menu className="h-8 w-8 text-primary-dark"/>
                <div>
                  <div className="w-6 h-1 bg-primary-dark mb-1.5 rounded-lg"></div>
                  <div className="w-4 h-1 bg-primary-dark mb-1.5 rounded-lg"></div>
                  <div className="w-2 h-1 bg-primary-dark rounded-lg"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {/* Mobile menu: always present but translated off-screen when closed so it can animate */}
        <div
          className={cn(
            "fixed z-50 left-0 w-full lg:hidden transition-transform duration-300 ease-in-out",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          )}
          style={{ top: headerHeight }}
        >
          <div className="border-t border-gray-100 bg-white w-full">
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div>
                <div className="w-full bg-[#FBF8FF] rounded-lg border border-[#F3EAFF] px-4 py-2 flex items-center gap-2">
                  <label htmlFor="mobile-search">
                    <Search className="h-6 w-6" />
                  </label>
                  <input
                    id="mobile-search"
                    type="text"
                    placeholder="Search ..."
                    className="block w-full px-2 py-2 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 size-4" />
                    Log Out
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button className="w-full">Logga In</Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* spacer to avoid layout jump when header becomes fixed */}
      {isSticky && (
        <div style={{ height: headerHeight }} aria-hidden className="w-full" />
      )}
      {/*overlay*/}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs h-screen w-full"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
