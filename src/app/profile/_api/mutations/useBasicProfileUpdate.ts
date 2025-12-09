import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";

export type BasicProfileRequestType = {
  name: string;
  mobile: string;
  avatar?: File | string;
  dob: string;
  gender: "male" | "female" | "other";
  details: Partial<{
    current_pregnancy_week: number | null;
    due_date: string | null;
    last_period_date: string | null;
    family_name: string;
    partner_name: string;
    babies?: Baby[];
  }>;
};

type Baby = {
  upcoming: boolean;
  start_week_date: string | null; // ISO 8601 date string
  partner_name: string;
  name: string;
  gender: "male" | "female" | "other";
  dob?: string; // ISO 8601 date string, only for non-upcoming babies
  weight?: number; // in kg
  height?: number; // in cm
  baby_image?: string;
};

export const useBasicProfileUpdate = () => {
  return useMutation({
    mutationKey: ["/update-profile"],
    mutationFn: (body: BasicProfileRequestType) => {
      return api.patch(
        "/user/profile",
        omitEmpty({
          ...body,
          avatar:
            typeof body?.avatar === "string"
              ? body?.avatar?.includes("https")
                ? ""
                : body.avatar
              : body.avatar,
        })
      );
    },
  });
};
