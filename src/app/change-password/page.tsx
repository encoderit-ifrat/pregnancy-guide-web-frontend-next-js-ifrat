import React from "react";
import { Metadata } from "next";
import ChangePasswordClientPage from "./ChangePasswordClientPage";

export const metadata: Metadata = {
  title: "Ändra lösenord | Familj.se",
  description: "Ändra ditt lösenord på Familj.se.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChangePasswordPage() {
  return <ChangePasswordClientPage />;
}
