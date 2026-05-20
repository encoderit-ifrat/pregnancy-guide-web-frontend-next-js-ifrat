import React from "react";
import { Metadata } from "next";
import MatchedNamesClientPage from "./MatchedNamesClientPage";

export const metadata: Metadata = {
  title: "Era matchade barnnamn | Familj.se",
  description:
    "Namnen ni båda har gillat under namnswajpen. Spara, dela och bestäm tillsammans vilket namn som passar bäst.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Era matchade barnnamn | Familj.se",
    description:
      "Namnen ni båda har gillat under namnswajpen. Spara, dela och bestäm tillsammans vilket namn som passar bäst.",
  },
};

export default function Page() {
  return <MatchedNamesClientPage />;
}
