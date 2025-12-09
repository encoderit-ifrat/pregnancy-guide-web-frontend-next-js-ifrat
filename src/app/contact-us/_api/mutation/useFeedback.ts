import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type feedbackType = {
  name: string;
  email: string;
  rating: number;
  location: string;
  phone?: string;
  content: string;
};

export const useFeedback = () => {
  return useMutation({
    mutationKey: ["feedback-create"],
    mutationFn: (body: feedbackType) => api.post("/testimonials", body),
  });
};
