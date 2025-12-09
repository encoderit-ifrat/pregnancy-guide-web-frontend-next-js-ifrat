// components/base/BaseSearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function BaseSearchBar({
  onSearch,
  placeholder = "Search ...",
  defaultValue = "",
}: {
  onSearch?: (term: string) => void;
  placeholder?: string;
  defaultValue?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Auto-search on debounced value change
  useEffect(() => {
    if (onSearch && debouncedSearchTerm !== defaultValue) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) onSearch("");
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />

      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full h-12 rounded-full pl-12 pr-20 text-lg
             border-1 border-gray-300
             focus:!border-transparent focus:!ring-2 focus:!ring-purple-300 focus:!outline-none
             transition-all duration-200"
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
        onClick={handleSearch}
        className="absolute right-2 h-9 rounded-full text-sm px-4 bg-primary text-white hover:bg-primary/90"
      >
        Go
      </Button>
    </div>
  );
}
