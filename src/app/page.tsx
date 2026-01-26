import Image from "next/image";
import React from "react";
import TrackSection from "@/components/base/TrackSection";
import StepsSection from "@/components/base/StepSection";
import MessageSection from "@/components/base/MessageSection";
import ClientSection from "@/components/base/ClientSection";
import AboutSection from "@/components/base/AboutSection";
import ContentDetailsMiddle from "@/components/home/ContentDetailsMiddle";
import ContentDetailsLast from "@/components/home/ContentDetailsLast";
import BackgroundBannerHome from "@/components/home/BackgroundBannerHome";
import StatsSection from "@/components/base/StateSection";
import { Metadata } from "next";
import ScrollToTop from "@/app/pregnancy-overview/_components/ScrollToTop";
import {HeroSection} from "@/components/home/HeroSection";
import {MissionSection} from "@/components/home/MissionSection";
import {ConcaveCurve} from "@/components/ui/svg/ConcaveCurve";
import {AppShowcaseSection} from "@/components/home/AppShowcaseSection";
import WaveDivider from "@/components/ui/svg/WaveDivider";
import {HowItWorksSection} from "@/components/home/HowItWorksSection";
import {TrackYourWeekSection} from "@/components/home/TrackWeekSection";
import {WhyChooseUsSection} from "@/components/home/WhyChooseUsSection";
import {DownloadCtaSection} from "@/components/home/DownloadCtaSection";
import {TestimonialsSection} from "@/components/home/TestimonialsSection";
import {Footer} from "react-day-picker";

export const metadata: Metadata = {
  title: "Home | Familij",
  description: "Track and monitor your pregnancy journey",
};

// Fetch articles data at build time
async function getHomePageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
      // Enable ISR with revalidation (optional)
      next: { revalidate: 10 }, // Revalidate every hour
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
        <TrackYourWeekSection/>
        {/* divider */} <WaveDivider className="text-primary-light" bgClassName="bg-[#FDFBFF]"/>
        <WhyChooseUsSection/>
        <DownloadCtaSection/>
        <TestimonialsSection/>
      </main>
      {/* divider */} <WaveDivider className="text-primary"/>
      <Footer/>
    </div>
  );
}