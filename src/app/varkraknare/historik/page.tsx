import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import HistoryClientPage from "./HistoryClientPage";

export const metadata: Metadata = {
  title: "Värkräknare – Historik",
  description:
    "Se historik över dina tidigare sammandragningssessioner och jämför mönster.",
  alternates: { canonical: canonicalUrl("/varkraknare/historik") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HistoryClientPage />;
}
