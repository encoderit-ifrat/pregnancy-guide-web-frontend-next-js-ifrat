import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type babyRequestType = {
  name?: string;
  gender?: string;
  due_date?: string;
  last_period_date?: string;
  upcoming?: boolean;
  dob?: string;
  weight?: number;
  height?: number;
};

export const useBabyUpdate = (babyId: string) => {
  return useMutation({
    mutationKey: ["baby-update"],
    mutationFn: (body: babyRequestType) =>
      api.patch(`user/profile/babies/${babyId}`, body),
  });
};
