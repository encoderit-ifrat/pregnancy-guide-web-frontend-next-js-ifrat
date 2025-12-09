import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type forgotPasswordRequestType = {
  email: string;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["/forgot-password"],
    mutationFn: (body: forgotPasswordRequestType) =>
      api.post("/auth/forgot-password", body),
  });
};
