import React from "react";
import { Metadata } from "next";
import ResendEmailForm from "./_component/ResendEmailForm";
import Image from "next/image";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Skicka verifieringslänk igen",
  description: "Skicka verifieringslänk för e-post igen på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/resend-verify-email"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Skicka verifieringslänk igen",
    description: "Skicka verifieringslänk för e-post igen på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skicka verifieringslänk igen",
    description: "Skicka verifieringslänk för e-post igen på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function page() {
  return (
    <div className="pb-56">
      <div className="flex items-center justify-center pt-28 lg:pt-33 pb-20 lg:pb-60 p-4">
        <ResendEmailForm />
      </div>
      {/* <Image
        src="/assets/logo/vectorSecond.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="w-full h-auto object-cover"
        priority
      /> */}
    </div>
  );
}
