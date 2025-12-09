import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchDrawer() {
  const router = useRouter();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 ">
      <div className="flex items-center gap-4">
        <>
          <Button
            variant="outline"
            size="icon"
            className="border-none outline-none bg-transparent"
            onClick={() => router.replace("/search-article")}
            // onClick={() => setShowSearch(true)}
          >
            <div className="bg-purple-500/10 p-2 rounded-full">
              <Search className="h-5 w-5 text-purple-700" />
            </div>
          </Button>
        </>
      </div>
    </nav>
  );
}
