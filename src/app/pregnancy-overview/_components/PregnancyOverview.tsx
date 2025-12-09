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

export default function PregnancyOverview({ pregnancyData }: any) {
  const { articles, questions, checklist, weeklyDetails, userProfile } =
    pregnancyData ?? {};
  const latest = articles?.latest || {};
  const popularWeek = articles?.popularWeek || {};
  const specialArticle = articles?.specialArticle || {};
  const bannerArticle = articles?.bannerArticle || {};
  const weeklyArticle = articles?.weeklyArticles || {};
  return (
    <div className="">
      <ScrollToTop />
      <OverviewCategories />
      <PregnancyDetails
        userData={userProfile || {}}
        weeklyDetails={weeklyDetails || {}}
      />
      {Boolean(weeklyArticle?.[0]?.title) && (
        <WeeklyDetails data={weeklyArticle?.[0]} />
      )}
      {Boolean(questions?.data?.[0]?._id) && (
        <QuestionOfTheWeek question={questions?.data?.[0]} />
      )}
      {Boolean(popularWeek?.[0]?.title) && (
        <WeeklyArticle data={popularWeek?.[0]} />
      )}

      <section className="-mt-1">
        <div className="bg-sidebar-accent">
          <CheckLists
            checkLists={checklist?.data}
            count={checklist?.pagination.total}
          />
        </div>
      </section>
      {Boolean(latest?.length) && (
        <section>
          <ArticleSection data={latest ?? []} />
        </section>
      )}
      <ImageOverview data={bannerArticle ?? []} />

      {
        <section className="bg-[#B8A8D2] pb-32 md:pb-96">
          <SpecialArticleSection data={specialArticle ?? []} />
        </section>
      }
    </div>
  );
}
