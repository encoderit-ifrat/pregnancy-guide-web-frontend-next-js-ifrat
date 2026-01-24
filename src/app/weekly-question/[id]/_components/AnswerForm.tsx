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
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/progress";

import { usePathname } from "next/navigation";
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
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
          {children}
        </div>
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
      Q: {title}
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

  return (
    <RadioGroup
      value={option}
      onValueChange={(val) => {
        setOption(val);
      }}
      className="mt-3 mb-6"
      {...props}
      // disabled={hasAnswered}
    >
      {answer_options?.length > 0 &&
        answer_options.map((option) => {
          return (
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              key={option._id}
            >
              <div className="flex items-center gap-3 flex-1">
                <RadioGroupItem
                  value={option._id}
                  id={option._id}
                  className="size-5 cursor-pointer!"
                />
                <Label
                  htmlFor={option._id}
                  className="capitalize font-normal text-lg cursor-pointer text-left"
                >
                  {option.content}
                </Label>
              </div>
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
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Send className="h-5 w-5 text-soft" />
        Share Your Comment
      </h3>

      <Textarea
        placeholder="Write your answer here..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        className="mb-4 text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        rows={3}
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
      onClick={() => {
        router.push(`/weekly-question/${question.id}?t=${Date.now()}`);
      }}
      className="w-full max-w-lg md:w-auto px-8 py-3 bg-soft hover:bg-soft/90 text-white rounded-full font-medium"
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
      className="w-full max-w-lg md:w-auto px-8 py-3 bg-soft hover:bg-soft/90 text-white rounded-full font-medium"
    >
      {isPending ? "Submitting..." : text}
    </Button>
  );
};
