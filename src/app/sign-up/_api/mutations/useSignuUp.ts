import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["/sign-up"],
    mutationFn: (body: RegisterFormType) => api.post("/auth/register", body),
  });
};
