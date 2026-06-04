import React from "react";
import { Metadata } from "next";
import ForgotPasswordClientPage from "./ForgotPasswordClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glömt lösenord",
  description:
    "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/glomt-losenord"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Glömt lösenord",
    description:
      "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glömt lösenord",
    description:
      "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientPage />;
}
