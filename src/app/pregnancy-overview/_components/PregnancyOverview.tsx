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
import {PregnancyOverviewProps} from "../_types/pregnancy_overview_types";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";

export default function PregnancyOverview({pregnancyData}: PregnancyOverviewProps) {
    const articles = pregnancyData?.articles;
    const questions = pregnancyData?.questions;
    const checklist = pregnancyData?.checklist;
    const weeklyDetails = pregnancyData?.weeklyDetails;
    const userProfile = pregnancyData?.userProfile;

    const latest = articles?.latest || [];
    const popularWeek = articles?.popularWeek || [];
    const specialArticle = articles?.specialArticle || [];
    const bannerArticle = articles?.bannerArticle || [];
    const weeklyArticle = articles?.weeklyArticles || [];

    const currentWeek = userProfile?.details?.current_pregnancy_data?.week || 0;
    console.log('12', userProfile)

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
            <OverviewCategories/>
            <PregnancyDetails
                userData={userProfile as any}
                weeklyDetails={weeklyDetails as any}
            />
            {/* divider */} <WaveDivider className="text-white" bgClassName="bg-[#F6F0FF]"/>
            {Boolean(weeklyArticle?.[0]?.title) && weeklyArticle?.[0] && (
                <WeeklyDetails data={weeklyArticle[0]}/>
            )}
            {Boolean(questions?.data?.[0]?._id) && (
                <>
                    {/* divider */} <ConcaveCurve className="text-[#F5EEFF] h-10! sm:h-20! md:h-24! lg:h-30!" bgClassName="bg-white"/>
                    <QuestionOfTheWeek
                        currentWeek={currentWeek}
                        question={questions?.data?.[0] as any}
                    />
                </>
            )}
            {Boolean(popularWeek?.[0]?.title) && popularWeek?.[0] && (
                <>
                    {/* divider */} <WaveDivider className="text-white" bgClassName="bg-[#F6F0FF]"/>
                    <WeeklyArticle data={popularWeek[0]}/>
                </>
            )}

            <section className="-mt-1">
                <div className="bg-sidebar-accent">
                    <CheckLists
                        checkLists={checklist?.data as any}
                        count={checklist?.pagination.total}
                    />
                </div>
            </section>
            {Boolean(latest?.length) && (
                <section>
                    <ArticleSection data={(latest as any) ?? []}/>
                </section>
            )}
            <ImageOverview data={(bannerArticle as any) ?? []}/>

            {
                <section className="bg-section pb-32 md:pb-96">
                    <SpecialArticleSection data={(specialArticle as any) ?? []}/>
                </section>
            }
        </div>
    );
}
