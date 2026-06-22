import { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import InvitationsClientPage from "./InvitationsClientPage";

export const metadata: Metadata = {
  title: "Inbjudningar",
  description:
    "Skapa vackra digitala inbjudningar till babyshower, gender reveal eller familjefest. Dela och håll koll på OSA.",
  alternates: { canonical: canonicalUrl("/inbjudningar") },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <InvitationsClientPage />;
}
