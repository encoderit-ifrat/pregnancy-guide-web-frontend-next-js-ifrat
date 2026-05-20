import React from "react";
import { Metadata } from "next";
import ResetPasswordClientPage from "./ResetPasswordClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Återställ lösenord | Familj.se",
  description: "Återställ ditt lösenord på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/auth/reset-password"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Återställ lösenord | Familj.se",
    description: "Återställ ditt lösenord på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Återställ lösenord | Familj.se",
    description: "Återställ ditt lösenord på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClientPage />;
}
