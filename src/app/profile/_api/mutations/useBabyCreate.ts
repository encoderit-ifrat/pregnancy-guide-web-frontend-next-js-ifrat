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

export const useBabyCreate = () => {
  return useMutation({
    mutationKey: ["baby-create"],
    mutationFn: (body: babyRequestType) =>
      api.post("/user/profile/babies", body),
  });
};
