"use client";

import React from "react";
import ArticleSection from "@/components/base/ArticleSection";
import SpecialArticleSection from "@/components/base/SpecialArticleSection";
import OverviewCategories from "./OverviewCategories";
import PregnancyDetails from "./PregnancyDetails";
import WeeklyDetails from "./WeeklyDetails";
import QuestionOfTheWeek from "./QuestionOfTheWeek";
import WeeklyArticle from "./WeeklyArticle";
import ImageOverview from "./ImageOverview";
import CheckLists from "./CheckLists";
import ScrollToTop from "@/app/pregnancy-overview/_components/ScrollToTop";
import WeekSelector from "./WeekSelector";
import { PregnancyOverviewProps } from "../_types/pregnancy_overview_types";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";
import WaveDivider2 from "@/components/layout/svg/WaveDivider2";
import IconHeading from "@/components/ui/text/IconHeading";
import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

export default function PregnancyOverview({
  pregnancyData,
}: PregnancyOverviewProps) {
  const articles = pregnancyData?.articles;
  const questions = pregnancyData?.questions;
  const checklist = pregnancyData?.checklist;
  const weeklyDetails = pregnancyData?.weeklyDetails;
  const userProfile = pregnancyData?.userProfile;

  const latest = articles?.latest || [];
  const popularWeeks = articles?.popularWeeks || [];
  const specialArticle = articles?.specialArticle || [];
  const bannerArticle = articles?.bannerArticle || [];
  const weeklyArticle = articles?.weeklyArticles || [];

  const currentWeek = userProfile?.details?.current_pregnancy_data?.week || 0;
  console.log("12", userProfile);

  const handleWeekChange = (week: number) => {
    // Handle week change logic here (e.g., fetch new data for that week)
    console.log("Week changed to:", week);
  };

  return (
    <div className="bg-[#F6F0FF]">
      {/* <ScrollToTop /> */}
      <WeekSelector
        currentWeek={currentWeek}
        onWeekChange={handleWeekChange}
        minWeek={0}
        maxWeek={45}
      />
      <OverviewCategories />
      <PregnancyDetails
        userData={userProfile as any}
        weeklyDetails={weeklyDetails as any}
      />
      {/* divider */}{" "}
      <WaveDivider className="text-white" bgClassName="bg-[#F6F0FF]" />
      {Boolean(weeklyArticle?.[0]?.title) && weeklyArticle?.[0] && (
        <WeeklyDetails data={weeklyArticle[0]} />
      )}
      {Boolean(questions?.data?.[0]?._id) && (
        <QuestionOfTheWeek
          currentWeek={currentWeek}
          question={questions?.data?.[0] as any}
        />
      )}
      {popularWeeks && popularWeeks?.length > 0 && (
        <>
          <WeeklyArticle articles={popularWeeks} />
        </>
      )}
      <section className="relative w-full mx-auto">
        <div>
          {/* Background image */}
          <div className="absolute inset-0 z-0 bg-[url('/images/checklist-bg.png')] bg-cover bg-center" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#240443] to-[#230343]/0 pointer-events-none" />
          {/* Overlay image */}
          <div className="absolute inset-0 z-20 bg-[url('/images/heart-bg.png')] bg-cover bg-center opacity-10" />

          {/* Content */}
          <div className="relative z-30">
            <WaveDivider2
              waveColorClass="text-white"
              bgClassName="bg-transparent"
            />
            <div className="">
              <div className="text-center text-white">
                <IconHeading
                  text="Our CHECKLISTS"
                  icon={<Heart />}
                  className="text-white justify-center"
                />
                <SectionHeading className="text-white">
                  Weekly Details
                </SectionHeading>
                <p>
                  Expert advice, real stories, and helpful tips to support you
                  and your family at every stage.
                </p>
              </div>
              <CheckLists
                checkLists={checklist?.data as any}
                count={checklist?.pagination.total}
              />
            </div>
            <WaveDivider
              className="text-[#F6F0FF] transfor translate-y-[2px]"
              bgClassName="bg-transparent"
            />
          </div>
        </div>
      </section>
      {Boolean(latest?.length) && (
        <section>
          <ArticleSection data={(latest as any) ?? []} />
        </section>
      )}
      <ImageOverview data={(bannerArticle as any) ?? []} />
      {
        <section className="bg-section pb-32 md:pb-96">
          <SpecialArticleSection data={(specialArticle as any) ?? []} />
        </section>
      }
    </div>
  );
}
