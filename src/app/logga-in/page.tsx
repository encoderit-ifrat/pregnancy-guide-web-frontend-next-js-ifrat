import React from "react";
import { Metadata } from "next";
import LoginClientPage from "./LoginClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Logga in | Familj.se",
  description:
    "Logga in på ditt konto för att följa din graviditet, läsa veckans fråga och se era matchade barnnamn.",
  alternates: {
    canonical: canonicalUrl("/logga-in"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Logga in | Familj.se",
    description:
      "Logga in på ditt konto för att följa din graviditet, läsa veckans fråga och se era matchade barnnamn.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logga in | Familj.se",
    description:
      "Logga in på ditt konto för att följa din graviditet, läsa veckans fråga och se era matchade barnnamn.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function LoginPage() {
  return <LoginClientPage />;
}
