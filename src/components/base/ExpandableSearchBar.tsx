// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Search, X } from "lucide-react";
// import { useDebounce } from "@/hooks/useDebounce";

// export default function ExpandableSearchBar({
//   onSearch,
//   placeholder = "Search ...",
//   defaultValue = "",
// }: {
//   onSearch?: (term: string) => void;
//   placeholder?: string;
//   defaultValue?: string;
// }) {
//   const [expanded, setExpanded] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(defaultValue);
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//   const ref = useRef<HTMLDivElement>(null);

//   // Run search on debounce
//   useEffect(() => {
//     if (onSearch && debouncedSearchTerm !== defaultValue) {
//       onSearch(debouncedSearchTerm);
//     }
//   }, [debouncedSearchTerm]);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setExpanded(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = () => {
//     if (onSearch) onSearch(searchTerm);
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//     if (onSearch) onSearch("");
//   };

//   return (
//     <div ref={ref} className="relative flex items-center">
//       {/* 🔹 Collapsed icon button */}
//       {!expanded && (
//         <Button
//           // variant="ghost"
//           size="icon"
//           onClick={() => setExpanded(true)}
//           className="rounded-full hover:bg-gray-100 transition"
//         >
//           <Search className="w-5 h-5 text-gray-700" />
//         </Button>
//       )}

//       {/* 🔹 Expandable search input */}
//       <div
//         className={`relative flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
//           expanded ? "w-72 opacity-100 pl-0" : "w-0 opacity-0"
//         }`}
//       >
//         <Search className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />

//         <Input
//           placeholder={placeholder}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={`h-12 rounded-full pl-12 pr-20 text-lg border border-gray-300 transition-all duration-300
//           focus:border-none! focus:ring-0!  focus:outline-none!`}
//           autoFocus={expanded}
//         />

//         {searchTerm && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-16 text-gray-400 hover:text-gray-600"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}

//         <Button
//           onClick={handleSearch}
//           className="absolute right-2 h-9 rounded-full text-sm px-4 bg-primary text-white hover:bg-primary/90"
//         >
//           Go
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

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
          <div className="bg-purple-500/10 p-2 rounded-full">
            <Search className="h-5 w-5 text-purple-700" />
          </div>
        </Button>
      )}

      {/* 🔹 Expanded Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className={`relative flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "w-96 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Search className="absolute left-4 text-gray-400 size-4 md:size-5 pointer-events-none" />

        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10  rounded-full pl-8 md:pl-10 pr-20  border border-gray-300 transition-all duration-300
                     focus:ring-0! focus:outline-none!"
          autoFocus={expanded}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <Button
          // href={`/search-article?page=1&search=${debouncedSearchTerm}`}
          type="submit"
          className="absolute right-2 h-8 rounded-full text-sm px-4 bg-primary text-white hover:bg-primary/90 flex items-center justify-center"
        >
          Go
        </Button>
      </form>
    </div>
  );
}
