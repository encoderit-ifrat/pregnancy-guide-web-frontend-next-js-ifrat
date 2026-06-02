import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type verifyEmailRequestType = {
  token: string;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationKey: ["/login"],
    mutationFn: (body: verifyEmailRequestType) =>
      api.post("/auth/verify-email", body),
  });
};
