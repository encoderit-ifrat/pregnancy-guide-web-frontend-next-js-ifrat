import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ExpandableSearchBar({
  // onSearch,
  onExpandChange,
  placeholder = "Search",
  defaultValue = "",
  isExpanded = false,
}: {
  // onSearch?: (term: string) => void;
  onExpandChange?: (expanded: boolean) => void; // 👈 new prop
  placeholder?: string;
  defaultValue?: string;
  isExpanded?: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(isExpanded);
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  // const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const ref = useRef<HTMLDivElement>(null);

  // Debounce search
  // useEffect(() => {
  //   if (onSearch && debouncedSearchTerm !== defaultValue) {
  //     onSearch(debouncedSearchTerm);
  //   }
  // }, [debouncedSearchTerm]);

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
        onExpandChange?.(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    // if (onSearch) onSearch(searchTerm);
    router.replace(`/search-article?page=1&search=${searchTerm}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    router.replace(`/search-article`);

    // if (onSearch) onSearch("");
  };

  const handleExpand = () => {
    setExpanded(true);
    onExpandChange?.(true);
  };

  return (
    <div ref={ref} className="relative flex items-center">
      {/* 🔹 Collapsed Icon */}
      {!expanded && (
        <Button
          variant="outline"
          size="icon"
          className="border-none outline-none bg-transparent"
          // onClick={() => router.replace("/search-article")}
          onClick={handleExpand}
        >
          <div
            className="bg-primary-light text-secondary transition-colors hover:text-primary p-4 rounded-full"
            aria-label="Search"
          >
            <Search className="h-8 w-8 text-primary-dark" />
          </div>
        </Button>
      )}

      {/* 🔹 Expanded Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!expanded || !searchTerm) return
          handleSearch();
        }}
        className={`mt-2 transition-all duration-300 ease-in-out overflow-hidden ${expanded ? "w-96 opacity-100" : "w-0 opacity-0"
          }`}
      >
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={expanded}
          prepend={<Search className="size-4 md:size-5" />}
          append={
            <div className="flex items-center gap-2">
              {searchTerm && (
                <X onClick={handleClear} className="h-5 w-5 cursor-pointer" />
              )}
              <Button
                type="submit"
                className="-mr-3 h-11 rounded-md text-sm px-4 bg-primary text-white hover:bg-primary/90 flex items-center justify-center cursor-pointer"
              >Go</Button>
            </div>
          }
        />


      </form>
    </div>
  );
}
