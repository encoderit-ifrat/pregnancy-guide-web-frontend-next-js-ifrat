import React from "react";
import { Metadata } from "next";
import ForumClientPage from "./ForumClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Forum för blivande föräldrar",
  description:
    "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
  alternates: {
    canonical: canonicalUrl("/forum"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Forum för blivande föräldrar",
    description:
      "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forum för blivande föräldrar",
    description:
      "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function ForumPage() {
  return <ForumClientPage />;
}
