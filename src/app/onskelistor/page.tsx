import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import WishlistsClientPage from "./WishlistsClientPage";

export const metadata: Metadata = {
  title: "Önskelistor",
  description:
    "Skapa och dela din babyregistry med familj och vänner. Visa vad ni önskar er till er lilla.",
  alternates: { canonical: canonicalUrl("/onskelistor") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WishlistsClientPage />;
}
