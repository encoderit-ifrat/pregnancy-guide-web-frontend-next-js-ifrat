import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type updatePasswordRequestType = {
  currentPassword: string;
  newPassword: string;
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["/update-password"],
    mutationFn: (body: updatePasswordRequestType) =>
      api.patch("/user/profile/change-password", body),
  });
};
