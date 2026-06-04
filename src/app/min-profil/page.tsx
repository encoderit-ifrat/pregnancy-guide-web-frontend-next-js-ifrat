import { Metadata } from "next";
import ProfilePage from "./_component/profile";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Min profil",
  description:
    "Hantera din profil, dina inställningar och din information på Familj.se.",
  alternates: {
    canonical: canonicalUrl("/min-profil"),
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Min profil",
    description:
      "Hantera din profil, dina inställningar och din information på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Min profil",
    description:
      "Hantera din profil, dina inställningar och din information på Familj.se.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function Page() {
  return (
    <section className="">
      <ProfilePage />
    </section>
  );
}
