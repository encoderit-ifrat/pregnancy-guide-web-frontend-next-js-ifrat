"use client";
import {useQueryGetAllAnswers} from "@/app/weekly-question/[id]/_api/queries/useQueryGetAllAnswers";
import AnswerForm, {
    AnswerFormPercentage,
    AnswerFormRadioGroup,
    AnswerFormSeeAnswersButton,
    AnswerFormSubmitButton,
} from "@/app/weekly-question/[id]/_components/AnswerForm";
import React from "react";

import {QuestionOfTheWeekProps} from "@/app/weekly-question/[id]/_types/weekly_question_types";
import IconHeading from "@/components/ui/text/IconHeading";
import {FileQuestion} from "lucide-react";
import {SectionHeading} from "@/components/ui/text/SectionHeading";

function QuestionOfTheWeek({question, currentWeek}: QuestionOfTheWeekProps) {
    console.log("👉 ~ QuestionOfTheWeek ~ question:", question);

    const {data, isLoading} = useQueryGetAllAnswers({
        params: {id: question?._id},
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
        <section className="bg-[#F5EEFF] relative w-full mx-auto pb-10 md:pb-16">
            <div className="text-center">
                <IconHeading text="Question" icon={<FileQuestion/>} className="text-primary justify-center"/>
                <SectionHeading>Question of the Week</SectionHeading>
                {/* Week badge */}
                {typeof currentWeek !== "undefined" && (
                    <div className="inline-block bg-white/90 text-primary font-bold text-sm px-4 py-1 rounded-full mb-6">
                        Week {currentWeek} question
                    </div>
                )}
            </div>

            {/* Outer decorative card to match the target layout (large rounded container with subtle bottom shadow/highlight) */}
            <div className="md:max-w-4xl mx-auto rounded-2xl bg-white/40 p-3 pb-5 mt-8">
                <div className="bg-white rounded-3xl shadow-[0_10px_0_rgba(100,16,242,0.5)]">
                    {/* Place AnswerForm inside this outer card. The AnswerForm itself renders an inner white card where the options live. */}
                    <div className="flex flex-col items-center text-center">
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
                                <p className="font-roboto text-lg md:text-2xl lg:text-3xl font-medium text-text-dark mb-6">
                                    {question?.title}
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <AnswerFormRadioGroup disabled={hasAnswered}/>
                                    </div>
                                    {hasAnswered &&
                                        <div>
                                            <AnswerFormPercentage/>
                                        </div>
                                    }
                                </div>

                                <div className="mt-6">
                                    {hasAnswered ? (
                                        <AnswerFormSeeAnswersButton/>
                                    ) : (
                                        <AnswerFormSubmitButton/>
                                    )}
                                </div>
                            </AnswerForm>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default QuestionOfTheWeek;
