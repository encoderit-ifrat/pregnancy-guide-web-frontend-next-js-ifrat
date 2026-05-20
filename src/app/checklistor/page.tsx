import React from "react";
import { Metadata } from "next";
import ChecklistsClientPage from "./ChecklistsClientPage";

export const metadata: Metadata = {
  title: "Mina checklistor | Familj.se",
  description:
    "Dina checklistor inför förlossningen och tiden med bebis. Förbered sjukhusväskan, hemkomsten och allt däremellan i lugn och ro.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina checklistor | Familj.se",
    description:
      "Dina checklistor inför förlossningen och tiden med bebis. Förbered sjukhusväskan, hemkomsten och allt däremellan i lugn och ro.",
  },
};

export default function ChecklistsPage() {
  return <ChecklistsClientPage />;
}
