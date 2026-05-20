import React from "react";
import { Metadata } from "next";
import ChangePasswordClientPage from "./ChangePasswordClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ändra lösenord | Familj.se",
  description: "Ändra ditt lösenord på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/change-password"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Ändra lösenord | Familj.se",
    description: "Ändra ditt lösenord på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ändra lösenord | Familj.se",
    description: "Ändra ditt lösenord på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function ChangePasswordPage() {
  return <ChangePasswordClientPage />;
}
