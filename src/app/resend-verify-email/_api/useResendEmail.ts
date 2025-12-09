import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type resendEmailRequestType = {
  email: string;
};

export const useResendEmail = () => {
  return useMutation({
    mutationKey: ["/resend-verify-email"],
    mutationFn: (body: resendEmailRequestType) =>
      api.post("/auth/resend-verify-email", body),
  });
};
