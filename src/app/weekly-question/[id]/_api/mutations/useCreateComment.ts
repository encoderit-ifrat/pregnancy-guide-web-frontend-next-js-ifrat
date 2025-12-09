import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type TProps = {
  id: string | number;
  questionId: string;
  comment: string;
};

export const useCreateComment = () => {
  return useMutation({
    mutationKey: ["useCreateComment"],
    mutationFn: (body: TProps) => {
      const { id, questionId, comment } = body;
      return api.post(`/questioncomments`, {
        answerId: id,
        questionId,
        comment,
      });
    },
  });
};
