import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type TProps = {
  id: string | number;
  comment: string;
  answer_option_id: string;
};

export const useCreateAnswer = () => {
  return useMutation({
    mutationKey: ["useCreateAnswer"],
    mutationFn: (body: TProps) => {
      const { id, answer_option_id, comment } = body;
      return api.post(`/questions/${id}/answers`, {
        answer_option_id,
        comment,
      });
    },
  });
};
