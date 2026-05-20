import React from "react";
import { Metadata } from "next";
import SwipeClientPage from "./SwipeClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
  description:
    "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
  alternates: {
    canonical: canonicalUrl("/barnnamn/swajp"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
    description:
      "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
    description:
      "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function Page() {
  return <SwipeClientPage />;
}
