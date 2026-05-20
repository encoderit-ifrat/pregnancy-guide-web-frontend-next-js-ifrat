import React from "react";
import { Metadata } from "next";
import SwipeClientPage from "./SwipeClientPage";

export const metadata: Metadata = {
  title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
  description:
    "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
  openGraph: {
    title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
    description:
      "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Namnswajp | Välj barnnamn tillsammans | Familj.se",
    description:
      "Swajpa er igenom tusentals barnnamn tillsammans med din partner. Spara matchningar automatiskt och se vilka namn ni båda gillar. Skapa konto gratis.",
  },
};

export default function Page() {
  return <SwipeClientPage />;
}
