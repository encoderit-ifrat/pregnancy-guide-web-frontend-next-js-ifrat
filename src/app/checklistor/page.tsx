import React from "react";
import { Metadata } from "next";
import ChecklistsClientPage from "./ChecklistsClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mina checklistor | Familj.se",
  description:
    "Dina checklistor inför förlossningen och tiden med bebis. Förbered sjukhusväskan, hemkomsten och allt däremellan i lugn och ro.",
  alternates: {
    canonical: canonicalUrl("/checklistor"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Mina checklistor | Familj.se",
    description:
      "Dina checklistor inför förlossningen och tiden med bebis. Förbered sjukhusväskan, hemkomsten och allt däremellan i lugn och ro.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina checklistor | Familj.se",
    description:
      "Dina checklistor inför förlossningen och tiden med bebis. Förbered sjukhusväskan, hemkomsten och allt däremellan i lugn och ro.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function ChecklistsPage() {
  return <ChecklistsClientPage />;
}
