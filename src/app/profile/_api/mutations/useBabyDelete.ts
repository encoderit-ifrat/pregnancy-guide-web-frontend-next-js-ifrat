import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type babyRequestType = {
  id: string;
};

export const useBabyDelete = () => {
  return useMutation({
    mutationKey: ["baby-delete"],
    mutationFn: (body: babyRequestType) =>
      api.delete(`user/profile/babies/${body.id}`),
  });
};
