"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ArticleSection from "@/components/base/ArticleSection";
import SpecialArticleSection from "@/components/base/SpecialArticleSection";
import OverviewCategories from "./OverviewCategories";
import PregnancyDetails from "./PregnancyDetails";
import WeeklyDetails from "./WeeklyDetails";
import QuestionOfTheWeek from "./QuestionOfTheWeek";
import WeeklyArticle from "./WeeklyArticle";
import OurArticle from "./OurArticle";
import CheckLists from "./CheckLists";
import WeekSelector from "./WeekSelector";
import { PregnancyOverviewProps } from "../_types/pregnancy_overview_types";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import CheckListSection from "@/app/pregnancy-overview/_components/CheckListSection";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";

export default function PregnancyOverview({
  pregnancyData,
  selectedWeek,
}: PregnancyOverviewProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  const week = userProfile?.details?.current_pregnancy_data?.week ?? 0;
  const day = userProfile?.details?.current_pregnancy_data?.day ?? 0;
  // 18 week 1 day → 19; 18 week 0 day → 18
  const currentWeek = day > 0 ? week + 1 : week;

  // Use URL query param if present, otherwise fall back to user's current week
  const initialWeek = selectedWeek !== undefined ? selectedWeek : currentWeek;

  // Local state for instant UI feedback, debounced for URL/API update
  const [pendingWeek, setPendingWeek] = useState(initialWeek);
  const debouncedWeek = useDebounce(pendingWeek, 600);

  const handleWeekChange = (week: number) => {
    setPendingWeek(week);
  };

  // Push URL update only after debounce settles
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("selected-week", String(debouncedWeek));
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedWeek]);

  return (
    <div className="bg-[#F6F0FF]">
      {/* <ScrollToTop /> */}
      <WeekSelector
        currentWeek={initialWeek}
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
          <ArticleSection data={(latest as any) || []} />
        </section>
      )}

      {Boolean(bannerArticle.length) && (
        <>
          {/* divider */}
          <ConcaveCurve
            className="text-white h-10! sm:h-20! md:h-24! lg:h-42!"
            bgClassName="bg-primary-light"
          />
          <OurArticle data={(bannerArticle as any) ?? []} />
        </>
      )}
      {Boolean(specialArticle.length) && (
        <>
          {/* divider */}
          <WaveDivider className="text-primary-light" bgClassName="bg-white" />
          <SpecialArticleSection data={(specialArticle as any) ?? []} />
        </>
      )}
    </div>
  );
}
