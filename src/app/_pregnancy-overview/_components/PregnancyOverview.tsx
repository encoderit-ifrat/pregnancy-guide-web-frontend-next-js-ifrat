"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ArticleSection, { Article } from "@/components/base/ArticleSection";
import { Article as OurArticleType } from "@/app/_pregnancy-overview/_components/OurArticle";
import { Article as SpecialArticleType } from "@/components/base/SpecialArticleSection";
import SpecialArticleSection from "@/components/base/SpecialArticleSection";
import OverviewCategories from "./OverviewCategories";
import PregnancyDetails from "./PregnancyDetails";
import WeeklyDetails from "./WeeklyDetails";
import QuestionOfTheWeek from "./QuestionOfTheWeek";
import WeeklyArticle from "./WeeklyArticle";
import OurArticle from "./OurArticle";
import OverviewChecklist from "./OverviewChecklist";
import WeekSelector from "./WeekSelector";
import { PregnancyOverviewProps } from "../_types/pregnancy_overview_types";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import CheckListSection from "@/app/_pregnancy-overview/_components/CheckListSection";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";
import { Question as QuestionType } from "@/app/weekly-question/[id]/_types/weekly_question_types";
import Loading from "@/app/loading";

let sessionSelectedWeek: number | null = null;

export default function PregnancyOverview({
  pregnancyData,
  selectedWeek,
}: PregnancyOverviewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const week = userProfile?.details?.current_pregnancy_data?.week ?? 3;
  const day = userProfile?.details?.current_pregnancy_data?.day ?? 0;
  // 18 week 1 day → 19; 18 week 0 day → 18
  const rawWeek = day > 0 ? week + 1 : week;
  const currentWeek = Math.min(Math.max(rawWeek, 3), 41);

  // Initial client redirect check
  const [isRedirecting, setIsRedirecting] = useState(
    selectedWeek !== undefined &&
      selectedWeek !== currentWeek &&
      sessionSelectedWeek === null
  );

  // Use URL param if present, otherwise fall back to user's current week
  const initialWeek = selectedWeek !== undefined ? selectedWeek : currentWeek;

  // Local state for instant UI feedback, debounced for URL update
  const [pendingWeek, setPendingWeek] = useState(initialWeek);
  const debouncedWeek = useDebounce(pendingWeek, 100);

  // Handle redirect on initial load or reload
  useEffect(() => {
    if (sessionSelectedWeek === null) {
      if (selectedWeek !== currentWeek) {
        if (selectedWeek !== undefined && (selectedWeek > 41 || selectedWeek < 3)) {
          sessionSelectedWeek = currentWeek;
          setPendingWeek(currentWeek);
          router.replace(`/gravid/vecka/${currentWeek}`);
        } else {
          sessionSelectedWeek = selectedWeek ?? currentWeek;
          setPendingWeek(selectedWeek ?? currentWeek);
          router.replace(`/gravid/vecka/${selectedWeek ?? currentWeek}`);
        }
        setIsRedirecting(false);
      } else {
        sessionSelectedWeek = currentWeek;
      }
    }
  }, [currentWeek, selectedWeek, router]);

  // Sync state when URL changes (e.g., browser back/forward or reload)
  useEffect(() => {
    if (selectedWeek !== undefined) {
      setPendingWeek(selectedWeek);
    }
  }, [selectedWeek]);

  // Clean up selected week if navigating away from vecka pages
  useEffect(() => {
    return () => {
      setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/gravid/vecka")
        ) {
          sessionSelectedWeek = null;
        }
      }, 50);
    };
  }, []);

  const handleWeekChange = (week: number) => {
    sessionSelectedWeek = week;
    setPendingWeek(week);
  };

  // Push URL update only after debounce settles (only for manual session changes)
  useEffect(() => {
    if (sessionSelectedWeek !== null) {
      const url = `/gravid/vecka/${debouncedWeek}`;
      startTransition(() => {
        router.push(url);
      });
    }
  }, [debouncedWeek, currentWeek, router]);

  if (isRedirecting) {
    return <Loading />;
  }

  console.log("initialWeek", initialWeek);
  console.log("selectedWeek", selectedWeek);
  console.log("currentWeek", currentWeek);
  console.log("debouncedWeek", debouncedWeek);
  console.log("pendingWeek", pendingWeek);
  console.log("isRedirecting", isRedirecting);

  return (
    <div className="bg-[#F6F0FF]">
      {/* <ScrollToTop /> */}
      <WeekSelector
        currentWeek={initialWeek}
        onWeekChange={handleWeekChange}
        minWeek={3}
        maxWeek={41}
        isLoading={isPending}
      />
      <OverviewCategories debouncedWeek={debouncedWeek} />
      <PregnancyDetails userData={userProfile} weeklyDetails={weeklyDetails} />
      {/* divider */}
      <WaveDivider className="text-white" bgClassName="bg-[#F6F0FF]" />
      {Boolean(weeklyArticle?.[0]?.title) && weeklyArticle?.[0] && (
        <WeeklyDetails data={weeklyArticle[0]} />
      )}
      {Boolean(questions?.data?.[0]?._id) &&
        userProfile?.roles?.[0].name !== "partner" && (
          <QuestionOfTheWeek
            currentWeek={initialWeek}
            question={questions?.data?.[0] as unknown as QuestionType}
          />
        )}
      {/*popular weekly articles section*/}
      {popularWeeks && popularWeeks?.length > 0 && (
        <WeeklyArticle articles={popularWeeks} />
      )}
      {/* Checklist Section */}

      <CheckListSection>
        <OverviewChecklist
          checkLists={checklist?.data}
          count={checklist?.pagination.total}
        />
      </CheckListSection>
      {Boolean(latest?.length) && (
        <section className="bg-purple-soft">
          <ArticleSection data={(latest as Article[]) || []} />
        </section>
      )}

      {Boolean(bannerArticle.length) && (
        <>
          <ConcaveCurve
            className="text-white h-10! sm:h-20! md:h-24! lg:h-42!"
            bgClassName="bg-purple-soft"
          />
          <OurArticle
            data={(bannerArticle as OurArticleType[]) ?? []}
            weeklyDetails={weeklyDetails}
          />
        </>
      )}
      {Boolean(specialArticle.length) && (
        <>
          {/* divider */}
          <WaveDivider className="text-primary-light" bgClassName="bg-white" />
          <SpecialArticleSection
            data={(specialArticle as SpecialArticleType[]) ?? []}
            weeklyDetails={weeklyDetails}
          />
        </>
      )}
    </div>
  );
}
