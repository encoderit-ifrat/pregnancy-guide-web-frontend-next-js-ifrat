import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import StatisticsClientPage from "./StatisticsClientPage";

export const metadata: Metadata = {
  title: "Värkräknare – Statistik",
  description:
    "Se statistik och analys av dina sammandragningar – frekvens, varaktighet och mönster.",
  alternates: { canonical: canonicalUrl("/varkraknare/statistik") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StatisticsClientPage />;
}
