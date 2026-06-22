import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import ContractionClientPage from "./ContractionClientPage";

export const metadata: Metadata = {
  title: "Värkräknare",
  description:
    "Tajma dina sammandragningar och håll koll på längd och frekvens – så vet du när det är dags att åka till sjukhuset.",
  alternates: { canonical: canonicalUrl("/varkraknare") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ContractionClientPage />;
}
