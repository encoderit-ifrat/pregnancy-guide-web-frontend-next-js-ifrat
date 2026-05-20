import { Metadata } from "next";
import ProfilePage from "./_component/profile";

export const metadata: Metadata = {
  title: "Min profil | Familj.se",
  description:
    "Hantera din profil, dina inställningar och din information på Familj.se.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Min profil | Familj.se",
    description:
      "Hantera din profil, dina inställningar och din information på Familj.se.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Min profil | Familj.se",
    description:
      "Hantera din profil, dina inställningar och din information på Familj.se.",
  },
};

export default function Page() {
  return (
    <section className="">
      <ProfilePage />
    </section>
  );
}
