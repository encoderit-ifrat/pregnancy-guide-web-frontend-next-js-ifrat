import React from "react";
import { Metadata } from "next";
import AccountCreatedClientPage from "./AccountCreatedClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Konto skapat | Familj.se",
  description: "Ditt konto är verifierat. Logga in och börja använda Familj.se.",
  alternates: {
    canonical: canonicalUrl("/konto-skapat"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Konto skapat | Familj.se",
    description: "Ditt konto är verifierat. Logga in och börja använda Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konto skapat | Familj.se",
    description: "Ditt konto är verifierat. Logga in och börja använda Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function AccountCreatedPage() {
  return <AccountCreatedClientPage />;
}
