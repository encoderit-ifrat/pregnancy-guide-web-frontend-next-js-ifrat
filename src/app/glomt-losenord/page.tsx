import React from "react";
import { Metadata } from "next";
import ForgotPasswordClientPage from "./ForgotPasswordClientPage";

export const metadata: Metadata = {
  title: "Glömt lösenord | Familj.se",
  description:
    "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Glömt lösenord | Familj.se",
    description:
      "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glömt lösenord | Familj.se",
    description:
      "Återställ ditt lösenord och kom tillbaka till ditt konto på Familj.se.",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientPage />;
}
