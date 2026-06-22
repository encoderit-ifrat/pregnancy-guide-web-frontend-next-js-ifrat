import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import KickCounterClientPage from "./KickCounterClientPage";

export const metadata: Metadata = {
  title: "Sparkräknare",
  description:
    "Räkna din babys sparkar och rörelser under graviditeten. Håll koll på mönster och känn dig trygg.",
  alternates: { canonical: canonicalUrl("/sparkraknare") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <KickCounterClientPage />;
}
