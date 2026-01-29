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
import WeekSelector from "./WeekSelector";
import { PregnancyOverviewProps } from "../_types/pregnancy_overview_types";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import CheckListSection from "@/app/pregnancy-overview/_components/CheckListSection";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";

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
      {/* divider */}
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
      {/*popular weekly articles section*/}
      {popularWeeks && popularWeeks?.length > 0 && (
        <>
          <WeeklyArticle articles={popularWeeks} />
        </>
      )}
      {/* Checklist Section */}
      <CheckListSection>
        <CheckLists
          checkLists={checklist?.data as any}
          count={checklist?.pagination.total}
        />
      </CheckListSection>
      {Boolean(latest?.length) && (
        <section className="bg-primary-light">
          <ArticleSection data={[...latest, ...latest, ...latest]} />
        </section>
      )}
      {/* divider */}
      <ConcaveCurve
        className="text-white h-10! sm:h-20! md:h-24! lg:h-30!"
        bgClassName="bg-primary-light"
      />
      <ImageOverview data={(bannerArticle as any) ?? []} />
      {
        <section className="bg-white pb-32 md:pb-96">
          <SpecialArticleSection data={(specialArticle as any) ?? []} />
        </section>
      }
    </div>
  );
}
