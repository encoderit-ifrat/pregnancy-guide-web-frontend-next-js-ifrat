import React from "react";
import { Metadata } from "next";
import ResetPasswordClientPage from "./ResetPasswordClientPage";

export const metadata: Metadata = {
  title: "Återställ lösenord | Familj.se",
  description: "Återställ ditt lösenord på Familj.se.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClientPage />;
}
