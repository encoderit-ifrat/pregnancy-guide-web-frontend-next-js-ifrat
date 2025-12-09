import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type resetPasswordRequestType = {
  token: string;
  password: string;
  confirm_password: string;
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["/reset-password"],
    mutationFn: (body: resetPasswordRequestType) =>
      api.post("/auth/reset-password", body),
  });
};
