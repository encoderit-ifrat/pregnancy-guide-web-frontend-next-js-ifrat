import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import HistoryClientPage from "./HistoryClientPage";

export const metadata: Metadata = {
  title: "Sparkräknare – Historik",
  description:
    "Se historik över dina tidigare sparkräkningssessioner och jämför mönster.",
  alternates: { canonical: canonicalUrl("/sparkraknare/historik") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HistoryClientPage />;
}
