"use client";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import { ChevronLeft, ChevronRight, Loader, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Category } from "@/types/shared";
import { useQueryGetAllCategories } from "../Navbar/api/queries/useQueryGetAllCategories";
import { NavigationLink } from "../Navbar/_types/navbar_types";

export default function Navbar({ isSearchExpanded }: { isSearchExpanded: boolean }) {
    const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
    const { data: categories, isLoading: isLoadingCategories } =
        useQueryGetAllCategories();

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


    if (isLoadingCategories) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        );
    }
    return (
        <nav
            className={`flex-1 flex justify-center overflow-hidden transition-all duration-300 ${isSearchExpanded
                ? "opacity-0 pointer-events-none scale-95"
                : "opacity-100 scale-100"
                }`}
        >
            <div className="hidden md:flex items-center gap-2">
                {/* Left Scroll Button */}
                <ChevronLeft
                    className={`size-6 cursor-pointer ${canScrollLeft ? "" : "opacity-0"}`}
                    onClick={() => handleScroll("left")}
                />

                <div>
                    {/* Scrollable Navigation Menu */}
                    <NavigationMenu>
                        <div
                            ref={scrollRef}
                            className="overflow-x-auto overflow-y-hidden max-w-lg scrollbar-hide scroll-smooth "
                        >
                            <NavigationMenuList className="gap-2 xl:gap-6">
                                {navigationLinks.map((link, index) => (
                                    <NavigationMenuItem key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-text-dark-gray hover:text-primary font-medium text-sm lg:text-base whitespace-nowrap"
                                        >
                                            {link.label}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </div>
                    </NavigationMenu>
                </div>

                {/* Right Scroll Button */}

                <ChevronRight
                    className={`size-6 cursor-pointer ${canScrollRight ? "" : "opacity-0"}`}
                    onClick={() => handleScroll("right")}
                />

            </div>
        </nav>
    );
}
