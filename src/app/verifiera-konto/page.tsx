import React from "react";
import { Metadata } from "next";
import VerifyAccountClientPage from "./VerifyAccountClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Verifiera konto | Familj.se",
  description: "Verifiera din e-postadress för att aktivera ditt konto på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/verifiera-konto"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Verifiera konto | Familj.se",
    description: "Verifiera din e-postadress för att aktivera ditt konto på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verifiera konto | Familj.se",
    description: "Verifiera din e-postadress för att aktivera ditt konto på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function VerifyAccountPage() {
  return <VerifyAccountClientPage />;
}
