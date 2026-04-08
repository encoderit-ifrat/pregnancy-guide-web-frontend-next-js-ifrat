"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LayoutFooterVisibilityContextType = {
  searchArticleCount: number | null;
  setSearchArticleCount: (count: number | null) => void;
};

const LayoutFooterVisibilityContext =
  createContext<LayoutFooterVisibilityContextType | null>(null);

export function LayoutFooterVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchArticleCount, setSearchArticleCount] = useState<number | null>(
    null
  );

  const value = useMemo(
    () => ({ searchArticleCount, setSearchArticleCount }),
    [searchArticleCount]
  );

  return (
    <LayoutFooterVisibilityContext.Provider value={value}>
      {children}
    </LayoutFooterVisibilityContext.Provider>
  );
}

export function useLayoutFooterVisibility() {
  const context = useContext(LayoutFooterVisibilityContext);
  if (!context) {
    throw new Error(
      "useLayoutFooterVisibility must be used within LayoutFooterVisibilityProvider"
    );
  }
  return context;
}
