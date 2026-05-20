import React from "react";
import { Metadata } from "next";
import SignUpClientPage from "./SignUpClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Skapa konto | Familj.se",
  description:
    "Skapa ett gratis konto och följ er graviditet tillsammans. Veckovisa artiklar, checklistor, veckans fråga och verktyg för att hitta barnnamn.",
  alternates: {
    canonical: canonicalUrl("/skapa-konto"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Skapa konto | Familj.se",
    description:
      "Skapa ett gratis konto och följ er graviditet tillsammans. Veckovisa artiklar, checklistor, veckans fråga och verktyg för att hitta barnnamn.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skapa konto | Familj.se",
    description:
      "Skapa ett gratis konto och följ er graviditet tillsammans. Veckovisa artiklar, checklistor, veckans fråga och verktyg för att hitta barnnamn.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function SignUpPage() {
  return <SignUpClientPage />;
}
