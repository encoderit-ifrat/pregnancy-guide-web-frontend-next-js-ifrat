// providers/UserProvider.tsx
"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef } from "react";

export function UserProvider({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const { refetch } = useCurrentUser();
  const hasInitialized = useRef(false);

  // Auto-fetch on reload when authenticated (always get fresh data)
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.token &&
      !hasInitialized.current
    ) {
      hasInitialized.current = true;
      refetch(); // 👈 Always refetch on reload, regardless of cache
    }
  }, [status, session?.token, refetch]);

  // Reset on logout
  useEffect(() => {
    if (status === "unauthenticated") {
      hasInitialized.current = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    }
  }, [status]);

  return <>{children}</>;
}
