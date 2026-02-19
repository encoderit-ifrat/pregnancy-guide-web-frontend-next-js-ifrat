"use client";
import React, { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import AnswerForm, {
  AnswerFormComment,
  // AnswerFormComment,
  AnswerFormDescription,
  AnswerFormPercentage,
  AnswerFormRadioGroup,
  AnswerFormSubmitButton,
  AnswerFormTitle,
} from "./AnswerForm";
import { useQueryGetAllAnswers } from "../_api/queries/useQueryGetAllAnswers";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import CommentCard, { TCommentCard } from "@/components/base/CommentCard";
import Pagination from "@/components/base/Pagination";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

type TProps = {
  id: string;
  timestamp: string | null | undefined;
};

export default function WeeklyQuestionView({ id, timestamp }: TProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  // const router = useRouter();
  const { data, isLoading, refetch } = useQueryGetAllAnswers({
    params: {
      id,
      timestamp,

      page: page,
    },
  });
  const { question, answers, hasAnswered, statistics, userAnswer } =
    data?.data ?? {};

  const { data: allAnswers, pagination } = answers ?? {};
  console.log(
    "👉 ~ WeeklyQuestionView ~ allAnswers /questions/${params?.id}/answers:",
    allAnswers
  );
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/weekly-question/${id}?${params.toString()}`);
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <AnswerForm
        data={{
          hasAnswered,
          userAnswer,
          question: {
            id: question?._id,
            question: question?.title,
            description: question?.content,
            answers_count: question?.answers_count,
            answer_options: question?.answer_options,
          },
          statistics: statistics?.statistics || [],
        }}
        onAnswerSubmitted={() => {
          refetch();
        }}
      >
        <AnswerFormTitle />
        <AnswerFormDescription />
        <div className="grid grid-cols-1 mt-2 mb-10">
          {hasAnswered ? (
            <AnswerFormPercentage />
          ) : (
            <AnswerFormRadioGroup disabled={hasAnswered} />
          )}
        </div>
        {!Boolean(userAnswer?.comment) && (
          <div className="relative">
            <AnswerFormComment />
            <div className="absolute bottom-2 right-2">
              <AnswerFormSubmitButton text="Submit Comment" redirect={false} />
            </div>
          </div>
        )}
      </AnswerForm>

      <div className="space-y-4">
        <SectionHeading variant="h3">Submitted Comments</SectionHeading>

        {allAnswers?.length > 0 ? (
          allAnswers.map((answer: TCommentCard) => {
            console.log("👉 ~ WeeklyQuestionView ~ answer:", answer);
            return (
              <CommentCard
                key={answer._id}
                // content={
                //   question.answer_options.find(
                //     (oldAnswer: any) =>
                //       oldAnswer._id === answer.answer_option_id
                //   )?.content
                // }
                data={answer}
              />
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No answers yet. Be the first to share!
            </p>
          </div>
        )}
        {pagination && pagination.last_page > 1 && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page} // ← Changed from meta.total to meta.last_page
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
