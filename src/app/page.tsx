import React from "react";
import {Metadata} from "next";
import {ConcaveCurve} from "@/components/ui/svg/ConcaveCurve";
import WaveDivider from "@/components/ui/svg/WaveDivider";
import {HeroSection} from "@/components/home/HeroSection";
import {MissionSection} from "@/components/home/MissionSection";
import {AppShowcaseSection} from "@/components/home/AppShowcaseSection";
import {HowItWorksSection} from "@/components/home/HowItWorksSection";
import {TrackYourWeekSection} from "@/components/home/TrackWeekSection";
import {WhyChooseUsSection} from "@/components/home/WhyChooseUsSection";
import {DownloadCtaSection} from "@/components/home/DownloadCtaSection";
import {TestimonialsSection} from "@/components/home/TestimonialsSection";
import {StatsSection} from "@/components/home/StatsSection";

export const metadata: Metadata = {
  title: "Home | Familij",
  description: "Track and monitor your pregnancy journey",
};

// Fetch articles data at build time
async function getHomePageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
      // Enable ISR with revalidation (optional)
      next: {revalidate: 10}, // Revalidate every hour
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
  // Fetch data at build time
  const homePageData = await getHomePageData();
  console.log("👉 ~ Page ~ homePageData:", homePageData);

  return (
      <div className="min-h-svh bg-white">
        <main>
          <HeroSection/>
          <MissionSection/>
          {/* divider */} <ConcaveCurve/>
          <AppShowcaseSection/>
          {/* divider */} <WaveDivider className="text-[#F6F0FF]" bgClassName="bg-primary-light"/>
          <div className="bg-[#F6F0FF]">
            <HowItWorksSection/>
            <StatsSection/>
          </div>
          {/* divider */} <WaveDivider className="text-[#FDFBFF]" bgClassName="bg-[#F6F0FF]"/>
          <TrackYourWeekSection data={homePageData?.data?.articles || []}/>
          {/* divider */} <WaveDivider className="text-primary-light" bgClassName="bg-[#FDFBFF]"/>
          <WhyChooseUsSection/>
          <DownloadCtaSection/>
          <TestimonialsSection data={homePageData?.data?.testimonials?.data || []}/>
        </main>
      </div>
  );
}