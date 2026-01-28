"use client";
import { useQueryGetAllAnswers } from "@/app/weekly-question/[id]/_api/queries/useQueryGetAllAnswers";
import AnswerForm, {
  AnswerFormPercentage,
  AnswerFormRadioGroup,
  AnswerFormSeeAnswersButton,
  AnswerFormSubmitButton,
} from "@/app/weekly-question/[id]/_components/AnswerForm";
import { useRouter } from "next/navigation";
import React from "react";

import { QuestionOfTheWeekProps } from "@/app/weekly-question/[id]/_types/weekly_question_types";
import IconHeading from "@/components/ui/text/IconHeading";
import {FileQuestion} from "lucide-react";
import {SectionHeading} from "@/components/ui/text/SectionHeading";

function QuestionOfTheWeek({ question }: QuestionOfTheWeekProps) {
  console.log("👉 ~ QuestionOfTheWeek ~ question:", question);
  const router = useRouter();

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
  console.log("👉 ~ QuestionOfTheWeek ~ questionData:", data?.data);
  return (
    <section className="bg-[#F5EEFF] relative w-full mx-auto">
      <div className="text-center">
        <IconHeading text="Question" icon={<FileQuestion/>} className="text-primary justify-center"/>
        <SectionHeading>Question of the Week</SectionHeading>
      </div>
      <div className="my-6 space-y-4 relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-0 ">
        <p className="font-roboto text-base lg:text-xl font-normal text-text-dark">
          {question?.title}
        </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnswerFormRadioGroup disabled={hasAnswered} />
              {hasAnswered && <AnswerFormPercentage />}
            </div>
            <div className="mt-4">
              {hasAnswered ? (
                <AnswerFormSeeAnswersButton />
              ) : (
                <AnswerFormSubmitButton />
              )}
            </div>
          </AnswerForm>
        )}
      </div>
    </section>
  );
}

export default QuestionOfTheWeek;
