import Image from "next/image";
import React from "react";
import TrackSection from "@/components/base/TrackSection";
import StepsSection from "@/components/base/StepSection";
import MessageSection from "@/components/base/MessageSection";
import ClientSection from "@/components/base/ClientSection";
import AboutSection from "@/components/base/AboutSection";
import HeaderText from "@/components/ui/HeaderText";
import ContentDetailsMiddle from "@/components/Home/ContentDetailsMiddle";
import ContentDetailsLast from "@/components/Home/ContentDetailsLast";
import BackgroundBannerHome from "@/components/Home/BackgroundBannerHome";
import StatsSection from "@/components/base/StateSection";
import { Metadata } from "next";
import ScrollToTop from "@/app/pregnancy-overview/_components/ScrollToTop";

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
    <div className="bg-background min-h-svh pb-32  md:pb-96">
      <ScrollToTop />
      <BackgroundBannerHome />
      <ContentDetailsMiddle />
      <StepsSection />
      <TrackSection articles={homePageData?.data?.articles} />
      <StatsSection />
      <MessageSection />
      <ClientSection testimonials={homePageData?.data?.testimonials?.data} />
      <AboutSection />
      <ContentDetailsLast />
      {/* <Image
        src="/assets/logo/vectorSecond.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="w-full h-auto object-cover"
        priority
      /> */}
    </div>
  );
}

// Optional: Generate static params for dynamic routes
// export async function generateStaticParams() {
//   return [];
// }

// Optional: Configure dynamic behavior
// export const dynamic = 'force-static'; // or 'force-dynamic', 'auto'
// export const revalidate = 3600; // ISR: revalidate every hour
