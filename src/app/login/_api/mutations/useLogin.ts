import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { LoginSchemaType } from "../../_types/login_types";

export type loginRequestType = {
  email: string;
  password: string;
  remember: boolean;
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["/login"],
    mutationFn: (body: loginRequestType) => api.post("/auth/login", body),
  });
};
