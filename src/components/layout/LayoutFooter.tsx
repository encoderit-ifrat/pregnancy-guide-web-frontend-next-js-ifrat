"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import FooterWaveDivider from "@/components/layout/svg/FooterWaveDivider";
import { useLayoutFooterVisibility } from "@/components/layout/LayoutFooterVisibility";

export default function LayoutFooter() {
  const pathname = usePathname();
  const { searchArticleCount } = useLayoutFooterVisibility();

  const shouldHideFooterOnSearchArticle =
    pathname === "/search-article" &&
    (searchArticleCount === null || searchArticleCount === 1);

  if (shouldHideFooterOnSearchArticle) {
    return null;
  }

  return (
    <>
      <FooterWaveDivider />
      <Footer />
    </>
  );
}
