import React from "react";
import { Metadata } from "next";
import MyThreadsClientPage from "./MyThreadsClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mina forumämnen | Familj.se",
  description:
    "Dina publicerade ämnen i forumet och dina pågående diskussioner med andra blivande föräldrar.",
  alternates: {
    canonical: canonicalUrl("/forum/mina-amnen"),
  },
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
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina forumämnen | Familj.se",
    description:
      "Dina publicerade ämnen i forumet och dina pågående diskussioner med andra blivande föräldrar.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function Page() {
  return <MyThreadsClientPage />;
}
