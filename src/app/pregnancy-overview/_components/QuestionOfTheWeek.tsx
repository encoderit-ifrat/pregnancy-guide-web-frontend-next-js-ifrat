"use client";
import { useQueryGetAllAnswers } from "@/app/weekly-question/[id]/_api/queries/useQueryGetAllAnswers";
import AnswerForm, {
  AnswerFormPercentage,
  AnswerFormRadioGroup,
  AnswerFormSeeAnswersButton,
  AnswerFormSubmitButton,
} from "@/app/weekly-question/[id]/_components/AnswerForm";
import React from "react";

import { QuestionOfTheWeekProps } from "@/app/weekly-question/[id]/_types/weekly_question_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { FileQuestion } from "lucide-react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import ConcaveCurve from "@/components/layout/svg/ConcaveCurve";
import WaveDivider from "@/components/layout/svg/WaveDivider";

function QuestionOfTheWeek({ question, currentWeek }: QuestionOfTheWeekProps) {
  //   console.log("👉 ~ QuestionOfTheWeek ~ question:", question);

  const { data, isLoading } = useQueryGetAllAnswers({
    params: { id: question?._id },
  });
  const {
    question: questionData,
    // answers,
    hasAnswered,
    statistics,
    userAnswer,
  } = data?.data ?? {};
  //   console.log("👉 ~ QuestionOfTheWeek ~ questionData:", data?.data);
  return (
    <section className="relative w-full mx-auto">
      <div className="relative bg-[#F5EEFF] overflow-hidden">
        {/* Background image with 20% opacity */}
        <div className="absolute inset-0 bg-[url('/images/heart-bg.png')] bg-cover bg-center opacity-10"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* divider */}
          <ConcaveCurve
            className="text-[#F5EEFF] translate-y-px"
            bgClassName="bg-white"
            height=" h-10! sm:h-20! md:h-24! lg:h-30! xl:h-32!"
          />

          <div className="pb-10 md:pb-16">
            <div className="text-center">
              <IconHeading
                text="Question"
                icon={<FileQuestion />}
                className="text-primary justify-center"
              />
              <SectionHeading>Question of the Week</SectionHeading>
              {/* Week badge */}
              {typeof currentWeek !== "undefined" && (
                <div className="inline-block bg-white/90 text-primary font-semibold text-base md:text-lg px-4 py-1 rounded-full mb-6">
                  Week {currentWeek} question
                </div>
              )}
            </div>

            {/* Outer decorative card to match the target layout (large rounded container with subtle bottom shadow/highlight) */}
            <div className="md:max-w-4xl mx-auto rounded-2xl bg-white/40 p-3 pb-5 mt-8">
              <div className="bg-white rounded-3xl shadow-[0_8px_0_rgba(100,16,242,0.5)] md:shadow-[0_10px_0_rgba(100,16,242,0.5)]">
                {/* Place the AnswerForm inside this outer card. The AnswerForm itself renders an inner white card where the options live. */}
                <div className="flex flex-col items-center text-center p-3 pt-6 md:p-6">
                  {!isLoading && (
                    <AnswerForm
                      data={{
                        hasAnswered,
                        userAnswer,
                        question: {
                          id: questionData?._id,
                          question: questionData?.title,
                          description: questionData?.content,
                          answers_count: questionData?.answers_count,
                          answer_options: questionData?.answer_options,
                        },
                        statistics: statistics?.statistics || [],
                      }}
                    >
                      {/* Move the question title inside the AnswerForm so it sits within the white card. */}
                      <h4 className="font-roboto text-xl md:text-2xl lg:text-3xl font-medium text-text-dark mb-6">
                        {question?.title}
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        <AnswerFormRadioGroup disabled={hasAnswered} />
                        {/* {hasAnswered && (<AnswerFormPercentage />)} */}
                      </div>

                      <div className="my-6 md:mb-0 md:mt-6">
                        {hasAnswered ? (
                          <AnswerFormSeeAnswersButton />
                        ) : (
                          <AnswerFormSubmitButton />
                        )}
                      </div>
                    </AnswerForm>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* divider */}
          <WaveDivider className="text-white" bgClassName="bg-transparent" />
        </div>
      </div>
    </section>
  );
}

export default QuestionOfTheWeek;
