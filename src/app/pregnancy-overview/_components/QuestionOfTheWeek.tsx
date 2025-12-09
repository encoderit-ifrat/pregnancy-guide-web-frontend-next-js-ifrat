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

function QuestionOfTheWeek({ question }: { question: any }) {
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
    <section className="relative w-full mx-auto  py-10  lg:py-30 ">
      <div className="my-6 space-y-4 relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-0 ">
        <p className="font-poppins text-3xl lg:text-4xl font-semibold  whitespace-nowrap">
          Question of the Week
        </p>
        <p className="font-roboto text-base lg:text-xl font-normal text-text-dark">
          {question?.title}
        </p>
        {!isLoading && (
          // <AnswerForm
          // data={{
          //   hasAnswered,
          //   userAnswer,
          //   question: {
          //     id: questionData?._id,
          //     question: questionData?.title,
          //     description: questionData?.content,
          //     answers_count: questionData?.answers_count,
          //     answer_options: questionData?.answer_options,
          //   },
          //   statistics: statistics?.statistics || [],
          // }}
          //   overview={true}
          // />
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
