import React from "react";
import { Metadata } from "next";
import LoginClientPage from "./LoginClientPage";

export const metadata: Metadata = {
  title: "Logga in | Familj.se",
  description:
    "Logga in på ditt konto för att följa din graviditet, läsa veckans fråga och se era matchade barnnamn.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Logga in | Familj.se",
    description:
      "Logga in på ditt konto för att följa din graviditet, läsa veckans fråga och se era matchade barnnamn.",
  },
};

export default function LoginPage() {
  return <LoginClientPage />;
}
