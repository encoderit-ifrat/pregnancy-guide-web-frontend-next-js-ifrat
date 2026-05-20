import React from "react";
import { Metadata } from "next";
import SignUpClientPage from "./SignUpClientPage";

export const metadata: Metadata = {
  title: "Skapa konto | Familj.se",
  description:
    "Skapa ett gratis konto och följ er graviditet tillsammans. Veckovisa artiklar, checklistor, veckans fråga och verktyg för att hitta barnnamn.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Skapa konto | Familj.se",
    description:
      "Skapa ett gratis konto och följ er graviditet tillsammans. Veckovisa artiklar, checklistor, veckans fråga och verktyg för att hitta barnnamn.",
  },
};

export default function SignUpPage() {
  return <SignUpClientPage />;
}
