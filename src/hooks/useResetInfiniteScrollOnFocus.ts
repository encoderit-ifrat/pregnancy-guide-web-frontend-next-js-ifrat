import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type Options = {
  /**
   * React Query key prefix used by the infinite query, e.g. ["get-threads"].
   * We remove queries starting with this key when the tab becomes visible again.
   */
  queryKeyPrefix: (string | number)[];
  /**
   * If provided, only reset when the current pathname starts with this value.
   * Useful if the same query key is reused on multiple routes.
   */
  routePrefix?: string;
};

export function useResetInfiniteScrollOnFocus({
  queryKeyPrefix,
  routePrefix,
}: Options) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const matchesRoute = () => {
      if (!routePrefix) return true;
      try {
        return window.location.pathname.startsWith(routePrefix);
      } catch {
        return true;
      }
    };

    // Prevent browser from restoring an old scroll position on reload.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!matchesRoute()) return;

      // Smoothly scroll back to the top.
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      // Drop any cached infinite pages so the next mount starts from page 1.
      queryClient.removeQueries({ queryKey: queryKeyPrefix });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient, queryKeyPrefix, routePrefix]);
}

