"use client";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { MessageCircle, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/Accordion";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useCreateComment } from "@/app/weekly-question/[id]/_api/mutations/useCreateComment";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SectionHeading } from "../ui/text/SectionHeading";
import { useTranslation } from "@/providers/I18nProvider";

export type TCommentCard = {
  _id: string;
  question_id: string;
  comment: string;
  comments: {
    answerId: string;
    description: string;
    isActive: boolean;
    questionId: string;
    userId: string;
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
  answer_option_id: string;
  created_by: { name: string; avatar: string };
};
export type TCommentCardProps = {
  // content: string;
  data: TCommentCard;
};
export default function CommentCard({ data }: TCommentCardProps) {
  const { user: currentUser } = useCurrentUser();
  console.log("👉 ~ CommentCard ~ currentUser:", currentUser);

  const {
    _id,
    question_id,
    comment,
    comments = [],
    createdAt,
    updatedAt,
    created_by,
  } = data;
  console.log("👉 ~ CommentCard ~ data:", data);
  const [allComments, setAllComments] = useState([...comments]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (comments) {
      setAllComments([...comments]);
    }
  }, [comments]);
  const [text, setText] = useState("");
  const { mutate: mutateCreateComment, isPending } = useCreateComment();
  const { t } = useTranslation();
  const handleSubmit = () => {
    if (!Boolean(text)) {
      return toast.error(t("weeklyQuestion.writeCommentError"));
    }

    mutateCreateComment(
      {
        id: _id,
        questionId: question_id,
        comment: text,
      },
      {
        onSuccess: (res) => {
          const message = res.data.data;
          setAllComments((old) => [...old, { ...message, user: currentUser }]);
          console.log("👉 ~ handleSubmit ~ res::::", res);
          toast.success(t("weeklyQuestion.commentSubmitted"));
          setText("");
        },
      }
    );
  };
  return (
    <div
      key={_id}
      className="bg-white rounded-xl shadow-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow shadow-primary-light"
    >
      {/* User Info */}
      <div className="flex items-center gap-3 h-full">
        <div className="relative w-[150px] h-[150px] bg-purple-100">
          {created_by.avatar ? (
            <Image
              src={imageLinkGenerator(created_by.avatar)}
              alt={created_by.name}
              fill
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-600 font-semibold rounded">
              {created_by.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 h-full">
          <div className="flex items-center gap-4">
            <SectionHeading variant="h4" className="mb-0 pb-0">
              {created_by.name}
            </SectionHeading>
            <p className="bg-primary-light text-primary-dark rounded-full px-4 py-1 text-sm">
              {new Date(updatedAt || createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Comment Content */}
          <p className="h-full text-gray-800 leading-relaxed mb-4">
            {/* {content || "No answer"} */}
            {comment || t("weeklyQuestion.noAnswer")}
          </p>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="max-w-fit hover:no-underline hover:text-primary cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3 ">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 hover:text-primary">
                {allComments.length > 0 ? allComments.length : ""}{" "}
                {allComments.length === 0
                  ? t("weeklyQuestion.addComment")
                  : allComments.length === 1
                    ? t("weeklyQuestion.comment")
                    : t("weeklyQuestion.comments")}
              </span>
            </div>
          </div>
        </div>
        <div>
          {/* like / dislike */}
          <div className="flex items-center gap-2 md:mr-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full">
        {isOpen && (
          <div className="flex flex-col gap-4 text-balance">
            {allComments.length > 0 && (
              <div className="space-y-3 pl-6 pt-2">
                {allComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors flex gap-4"
                  >
                    <div className="relative w-[80px] h-[80px] bg-purple-100">
                      {comment?.user?.avatar ? (
                        <Image
                          src={imageLinkGenerator(comment?.user?.avatar)}
                          alt={comment?.user?.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-600 font-semibold rounded">
                          {comment?.user?.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 leading-relaxed">
                        {comment?.user?._id == currentUser.id
                          ? t("weeklyQuestion.you")
                          : comment?.user?.name}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-1">
              <SectionHeading variant="h4" className="mb-0 pb-0">
                {t("weeklyQuestion.shareComment")}
              </SectionHeading>
              <div className="relative">
                <Textarea
                  placeholder={t("weeklyQuestion.commentPlaceholder")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mb-4 text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  rows={4}
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    onClick={handleSubmit}
                    isLoading={isPending}
                    disabled={isPending}
                    className="w-full max-w-lg md:w-auto px-8 py-3 bg-soft hover:bg-soft/90 text-white rounded-full font-medium"
                  >
                    {t("weeklyQuestion.submit")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
