import React from "react";
import { Metadata } from "next";
import MatchedNamesClientPage from "./MatchedNamesClientPage";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Era matchade barnnamn | Familj.se",
  description:
    "Namnen ni båda har gillat under namnswajpen. Spara, dela och bestäm tillsammans vilket namn som passar bäst.",
  alternates: {
    canonical: canonicalUrl("/barnnamn/swajp/matchade"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Era matchade barnnamn | Familj.se",
    description:
      "Namnen ni båda har gillat under namnswajpen. Spara, dela och bestäm tillsammans vilket namn som passar bäst.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Era matchade barnnamn | Familj.se",
    description:
      "Namnen ni båda har gillat under namnswajpen. Spara, dela och bestäm tillsammans vilket namn som passar bäst.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function Page() {
  return <MatchedNamesClientPage />;
}
