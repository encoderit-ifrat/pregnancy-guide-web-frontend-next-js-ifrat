"use client";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { MessageCircle, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useQuestionLike } from "@/app/pregnancy-overview/_api/mutation/useQuestionLike";
import { useQuestionDislike } from "@/app/pregnancy-overview/_api/mutation/useQuestionDislike";
import { cn } from "@/lib/utils";
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
  likes?: string[];
  likes_count?: number;
  dislikes?: string[];
  dislikes_count?: number;
};
export type TCommentCardProps = {
  // content: string;
  data: TCommentCard;
  onActionSuccess?: () => void;
};
export default function CommentCard({ data, onActionSuccess }: TCommentCardProps) {
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
  const handleSubmit = () => {
    if (!Boolean(text)) {
      return toast.error("Please write your comment");
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
          toast.success("Comment submitted");
          setText("");
        },
      }
    );
  };

  const { mutate: mutateLike, isPending: isLikePending } = useQuestionLike();
  const { mutate: mutateDislike, isPending: isDislikePending } = useQuestionDislike();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikePending || isDislikePending) return;
    mutateLike({ id: _id }, { 
      onSuccess: () => {
        toast.success("Liked!");
        onActionSuccess?.();
      }
    });
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikePending || isDislikePending) return;
    mutateDislike({ id: _id }, { 
      onSuccess: () => {
        toast.success("Disliked!");
        onActionSuccess?.();
      }
    });
  };

  const isLiked = data?.likes?.includes(currentUser?._id);
  const isDisliked = data?.dislikes?.includes(currentUser?._id);
  return (
    <div
      key={_id}
      className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-md transition-shadow shadow-primary-light"
    >
      {/* User Info */}
      <div className="flex items-center gap-3 h-full">
        <div className="relative w-[80px] h-[80px] bg-purple-100 flex-shrink-0">
          {created_by.avatar ? (
            <Image
              src={imageLinkGenerator(created_by.avatar)}
              alt={created_by.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-600 font-semibold rounded-lg">
              {created_by.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 h-full">
          <div className="flex items-center gap-3">
            <h4 className="text-base font-bold text-foreground mb-0 pb-0">
              {created_by.name}
            </h4>
            <p className="bg-primary-light text-primary-dark rounded-full px-3 py-0.5 text-[10px] font-medium">
              {new Date(updatedAt || createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Comment Content */}
          <p className="h-full text-gray-800 text-sm leading-relaxed mb-2">
            {/* {content || "No answer"} */}
            {comment || "No answer"}
          </p>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="max-w-fit hover:no-underline hover:text-primary cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 hover:text-primary">
                {allComments.length > 0 ? allComments.length : ""}{" "}
                {allComments.length === 0
                  ? "Add Comment"
                  : allComments.length === 1
                    ? "Comment"
                    : "Comments"}
              </span>
            </div>
          </div>
        </div>
        <div>
          {/* like / dislike */}
          <div className="flex items-center gap-1.5 md:mr-2">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleLike}
                disabled={isLikePending || isDislikePending}
                className={cn(
                  "h-8 w-8 rounded-full",
                  isLiked && "bg-primary text-white border-primary hover:bg-primary/90"
                )}
              >
                <ThumbsUp className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
              </Button>
              <span className={cn("text-[10px] mt-0.5 font-medium", isLiked ? "text-primary" : "text-gray-400")}>
                {data.likes_count || 0}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDislike}
                disabled={isLikePending || isDislikePending}
                className={cn(
                  "h-8 w-8 rounded-full",
                  isDisliked && "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                )}
              >
                <ThumbsDown className={cn("h-3.5 w-3.5", isDisliked && "fill-current")} />
              </Button>
              <span className={cn("text-[10px] mt-0.5 font-medium", isDisliked ? "text-orange-500" : "text-gray-400")}>
                {data.dislikes_count || 0}
              </span>
            </div>
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
                    <div className="relative w-[40px] h-[40px] bg-purple-100 flex-shrink-0">
                      {comment?.user?.avatar ? (
                        <Image
                          src={imageLinkGenerator(comment?.user?.avatar)}
                          alt={comment?.user?.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-600 text-xs font-semibold rounded-md">
                          {comment?.user?.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-700 leading-tight">
                        {comment?.user?._id == currentUser.id
                          ? "You"
                          : comment?.user?.name}
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {comment?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-1">
              <SectionHeading variant="h3" className="mb-0 pb-0">
                Share Your Comment
              </SectionHeading>
              <div className="relative">
                <Textarea
                  placeholder="Write your comment here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mb-4 text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  rows={3}
                  size="sm"
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    onClick={handleSubmit}
                    isLoading={isPending}
                    disabled={isPending}
                    className="w-full max-w-lg md:w-auto px-8 py-3 bg-soft hover:bg-soft/90 text-white rounded-full font-medium"
                  >
                    Submit
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
