"use client";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/Accordion";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useCreateComment } from "@/app/weekly-question/[id]/_api/mutations/useCreateComment";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  return (
    <div
      key={_id}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-100">
          {created_by.avatar ? (
            <Image
              src={imageLinkGenerator(created_by.avatar)}
              alt={created_by.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-600 font-semibold">
              {created_by.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{created_by.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(updatedAt || createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Comment Content */}
      <p className="text-gray-800 leading-relaxed mb-4">
        {/* {content || "No answer"} */}
        {comment || "No answer"}
      </p>

      {/* Comments Section */}
      {
        <Accordion
          type="single"
          collapsible
          className="w-full"
          // defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger
              className="max-w-fit hover:no-underline hover:text-primary cursor-pointer"
              showIcon={false}
            >
              <div className="flex items-center gap-2 mb-3 ">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 hover:text-primary">
                  {allComments.length > 0 ? allComments.length : ""}{" "}
                  {allComments.length === 0
                    ? "Add Comment"
                    : allComments.length === 1
                      ? "Comment"
                      : "Comments"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {allComments.length > 0 && (
                <div className="space-y-3 pl-6 border-l-2 border-purple-100">
                  {allComments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-xs font-bold text-gray-700 leading-relaxed">
                        {comment.user._id == currentUser.id
                          ? "You"
                          : comment.user.name}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-1">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Send className="h-5 w-5 text-soft" />
                  Share Your Comment
                </h3>

                <Textarea
                  placeholder="Write your comment here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mb-4 text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  rows={3}
                />
                <Button
                  onClick={handleSubmit}
                  isLoading={isPending}
                  disabled={isPending}
                  className="w-full max-w-lg md:w-auto px-8 py-3 bg-soft hover:bg-soft/90 text-white rounded-full font-medium"
                >
                  Submit
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
    </div>
  );
}
