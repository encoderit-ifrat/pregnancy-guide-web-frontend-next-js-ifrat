import React from "react";
import { Metadata } from "next";
import VerifyEmailClientPage from "./VerifyEmailClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Verifiera e-post",
  description: "Verifiera din e-postadress på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/auth/epost-verifierad"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Verifiera e-post",
    description: "Verifiera din e-postadress på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verifiera e-post",
    description: "Verifiera din e-postadress på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailClientPage />;
}
