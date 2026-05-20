import React from "react";
import { Metadata } from "next";
import MyThreadsClientPage from "./MyThreadsClientPage";

export const metadata: Metadata = {
  title: "Mina forumämnen | Familj.se",
  description:
    "Dina publicerade ämnen i forumet och dina pågående diskussioner med andra blivande föräldrar.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Mina forumämnen | Familj.se",
    description:
      "Dina publicerade ämnen i forumet och dina pågående diskussioner med andra blivande föräldrar.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina forumämnen | Familj.se",
    description:
      "Dina publicerade ämnen i forumet och dina pågående diskussioner med andra blivande föräldrar.",
  },
};

export default function Page() {
  return <MyThreadsClientPage />;
}
