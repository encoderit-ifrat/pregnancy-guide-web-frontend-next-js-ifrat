import { PaginationMeta } from "@/types/shared";

export type AnswerOption = {
  label: string;
  value: string | number;
};

export type Question = {
  _id: string;
  title: string;
  content?: string;
  week: number;
  answer_options: AnswerOption[];
  answers_count?: number;
  type: "radio" | "percentage" | "text";
};

export type Answer = {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string | null;
  };
  answer: string | number;
  comment?: string;
  createdAt: string;
};

export type Statistics = {
  label: string;
  value: number;
  percentage: number;
};

export type QuestionAnswersResponse = {
  question: Question;
  answers: {
    data: Answer[];
    pagination: PaginationMeta;
  };
  hasAnswered: boolean;
  statistics: {
    statistics: Statistics[];
  };
  userAnswer?: Answer;
};

export type WeeklyQuestionViewProps = {
  id: string;
  timestamp: string | null | undefined;
};

export type QuestionOfTheWeekProps = {
  question: Question;
  currentWeek: number;
};
