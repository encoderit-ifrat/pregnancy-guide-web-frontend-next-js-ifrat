import React from "react";
import { Metadata } from "next";
import ForumClientPage from "./ForumClientPage";

export const metadata: Metadata = {
  title: "Forum för blivande föräldrar | Familj.se",
  description:
    "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
  openGraph: {
    title: "Forum för blivande föräldrar | Familj.se",
    description:
      "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forum för blivande föräldrar | Familj.se",
    description:
      "Diskutera graviditet, förlossning och föräldraliv i en trygg gemenskap. Dela erfarenheter, ställ frågor och få stöd av andra blivande föräldrar.",
  },
};

export default function ForumPage() {
  return <ForumClientPage />;
}
