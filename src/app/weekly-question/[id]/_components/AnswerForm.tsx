"use client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCreateAnswer } from "../_api/mutations/useCreateAnswer";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  answers_count: string | number;
  description?: string;
  week?: number;
  answer_options: {
    content: string;
    vote_count: number;
    _id: string;
  }[];
};

type TProps = {
  data: {
    hasAnswered: boolean;
    question: Question;
    statistics: {
      option_id: string;
      content: string;
      count: number;
      percentage: number;
    }[];
    userAnswer?: {
      answer_option_id: string;
      comment: string;
      question_id: string;
    };
  };
  onAnswerSubmitted?: () => void;
  // overview?: boolean;
};
const AnswerFormContext = createContext<
  | (TProps & {
      option: string;
      setOption: (val: string) => void;
      answerText: string;
      setAnswerText: (val: string) => void;
    })
  | null
>(null);
const useAnswerFormContext = () => {
  const context = useContext(AnswerFormContext);
  if (!context) {
    throw new Error("useAnswerFormContext must be used inside of AnswerForm");
  }
  return context;
};
export default function AnswerForm({
  children,
  data,
  onAnswerSubmitted,
}: TProps & PropsWithChildren) {
  const { hasAnswered, userAnswer } = data;

  const [option, setOption] = useState<string>("");
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    if (hasAnswered && !!userAnswer) {
      setOption(userAnswer.answer_option_id);
    }
  }, [userAnswer, hasAnswered]);
  return (
    <AnswerFormContext.Provider
      value={{
        data,
        onAnswerSubmitted,
        option,
        setOption,
        answerText,
        setAnswerText,
      }}
    >
      <div className="w-full mx-auto space-y-8">
        <div className="bg-white rounded-2xl">{children}</div>
      </div>
    </AnswerFormContext.Provider>
  );
}

export const AnswerFormTitle = () => {
  const { data } = useAnswerFormContext();
  const { question } = data;
  const { question: title } = question;

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
      {title}
    </h1>
  );
};
export const AnswerFormDescription = () => {
  const { data } = useAnswerFormContext();
  const { question } = data;
  const { description } = question;

  return <p className="text-gray-600 text-lg leading-relaxed">{description}</p>;
};
export const AnswerFormRadioGroup = ({
  ...props
}: React.ComponentProps<typeof RadioGroup>) => {
  const { data, option, setOption } = useAnswerFormContext();
  const { question } = data;
  const { answer_options } = question;

  const getLetter = (index: number) => String.fromCharCode(97 + index); // a, b, c...

  return (
    <RadioGroup
      value={option}
      onValueChange={(val) => {
        setOption(val);
      }}
      className="mt-3 mb-6 flex flex-col gap-3"
      {...props}
      // disabled={hasAnswered}
    >
      {answer_options?.length > 0 &&
        answer_options.map((optionItem, idx) => {
          const isSelected = option === optionItem._id;
          return (
            <div className="w-full" key={optionItem._id}>
              <label
                htmlFor={optionItem._id}
                // onClick={() => setOption(optionItem._id)}
                className={`flex items-center gap-4 rounded-sm p-4 cursor-pointer transition-shadow ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : "bg-[#F2EAFB] text-foreground hover:shadow-md"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-12 w-10 rounded-full ${isSelected ? "bg-white text-primary" : "bg-white border border-purple-100 text-primary"} font-medium`}
                >
                  {getLetter(idx)}
                </div>

                <div
                  className={`flex-1 text-left text-lg font-normal capitalize ${isSelected ? "text-white" : "text-foreground"}`}
                >
                  {optionItem.content}
                </div>

                <RadioGroupItem
                  value={optionItem._id}
                  id={optionItem._id}
                  className="opacity-0 pointer-events-none absolute"
                />
              </label>
            </div>
          );
        })}
    </RadioGroup>
  );
};
export const AnswerFormPercentage = ({
  className,
}: React.ComponentProps<"div">) => {
  const { data } = useAnswerFormContext();
  const {
    question: { answer_options },
    statistics,
  } = data;

  if (!answer_options || answer_options.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {answer_options.map((option) => {
        const percentage =
          statistics.find((s) => s.option_id === option._id)?.percentage ?? 0;

        return (
          <div key={option._id} className="flex items-center gap-2 flex-1">
            <span>{percentage}%</span>
            <Progress value={percentage} />
          </div>
        );
      })}
    </div>
  );
};

export const AnswerFormComment = () => {
  const { answerText, setAnswerText } = useAnswerFormContext();

  return (
    <>
      <h3 className="text-xl font-bold text-foreground mb-8 gap-2">
        Share Your Comment
      </h3>

      <Textarea
        placeholder="Write your answer here..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        className="bg-white mb-4 text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        rows={4}
      />
    </>
  );
};
export const AnswerFormSeeAnswersButton = () => {
  const router = useRouter();
  const { data } = useAnswerFormContext();
  const { question } = data;

  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push(`/weekly-question/${question.id}?t=${Date.now()}`);
      }}
      className="sm:px-10 md:px-12"
    >
      See answers and comments
    </Button>
  );
};
export const AnswerFormSubmitButton = ({
  text = "Submit Answer",
  redirect = true,
}: {
  text?: string;
  redirect?: boolean;
}) => {
  const router = useRouter();

  const { data, option, answerText, setAnswerText, onAnswerSubmitted } =
    useAnswerFormContext();
  const { question } = data;
  const { mutate: mutateCreateAnswer, isPending } = useCreateAnswer();
  const handleSubmit = () => {
    if (!Boolean(option)) {
      return toast.error("Please select an answer option");
    }

    mutateCreateAnswer(
      {
        id: question.id,
        comment: answerText,
        answer_option_id: option,
      },
      {
        onSuccess: () => {
          onAnswerSubmitted && onAnswerSubmitted();
          if (redirect) {
            router.push(`/weekly-question/${question.id}?t=${Date.now()}`);
          }
          toast.success("Answer submitted");
          setAnswerText("");
        },
      }
    );
  };
  return (
    <Button
      onClick={handleSubmit}
      isLoading={isPending}
      disabled={isPending}
      className="w-full max-w-lg md:w-auto px-8 py-3"
    >
      {isPending ? "Submitting..." : text}
    </Button>
  );
};
