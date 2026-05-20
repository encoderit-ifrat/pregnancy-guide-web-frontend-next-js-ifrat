import React from "react";
import { Metadata } from "next";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { AppShowcaseSection } from "@/components/home/AppShowcaseSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TrackYourWeekSection } from "@/components/home/TrackWeekSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { DownloadCtaSection } from "@/components/home/DownloadCtaSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";

export const metadata: Metadata = {
  title: "Familj.se | Följ din graviditet vecka för vecka",
  description:
    "Följ din graviditet vecka för vecka tillsammans med din partner och familj. Artiklar, checklistor, veckans fråga och barnnamn samlat på ett ställe.",
  openGraph: {
    title: "Familj.se, för dig, din partner och hela familjen",
    description:
      "Allt ni behöver under graviditeten. Bjud in partner och familj, läs veckovisa artiklar, hitta barnnamn tillsammans och förbered er i lugn och ro.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
  },
  twitter: {
    card: "summary_large_image",
    title: "Familj.se | Följ din graviditet vecka för vecka",
    description:
      "Följ din graviditet vecka för vecka tillsammans med din partner och familj. Artiklar, checklistor, veckans fråga och barnnamn samlat på ett ställe.",
  },
};

// Fetch articles data at build time
async function getHomePageData(lang: string = "sv") {
  try {
    const res = await fetch(`${API_V1}/home?lang=${lang}`, {
      // Enable ISR with revalidation (optional)
      next: { revalidate: 10 }, // Revalidate every hour
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang,
        "x-lang": lang,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }

    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  // Get locale from cookies
  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  // Fetch data at build time
  const homePageData = await getHomePageData(locale);

  return (
    <div className="min-h-svh bg-white">
      <main>
        {/* <div className="bg-[url('/images/heart-bg.png')] bg-cover bg-center bg-no-repeat">
        </div> */}
        <HeroSection />
        <MissionSection />
        <AppShowcaseSection />
        {/* divider */}
        <WaveDivider
          className="text-[#F6F0FF]"
          bgClassName="bg-primary-light"
        />
        <div className="bg-[#F6F0FF]">
          <HowItWorksSection />
          <StatsSection />
        </div>
        {/* divider */}{" "}
        <WaveDivider className="text-[#FDFBFF]" bgClassName="bg-[#F6F0FF]" />
        <TrackYourWeekSection />
        {/* divider */}{" "}
        <WaveDivider
          className="text-primary-light"
          bgClassName="bg-[#FDFBFF]"
        />
        <WhyChooseUsSection data={homePageData?.data?.articles || []} />
        <DownloadCtaSection />
        <TestimonialsSection
          data={homePageData?.data?.testimonials?.data || []}
        />
      </main>
    </div>
  );
}
