import React from "react";
import { Metadata } from "next";
import VerifyEmailClientPage from "./VerifyEmailClientPage";

export const metadata: Metadata = {
  title: "Verifiera e-post | Familj.se",
  description: "Verifiera din e-postadress på Familj.se.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailClientPage />;
}
