import { BasicProfileRequestType } from "../_api/mutations/useBasicProfileUpdate";
import { BabyProfile } from "./profile_types";

export type ProfileFormData = {
  type: "default" | "update" | "delete";
  id: string;
  data?: BasicProfileRequestType;
};

export type FormProfileProps = {
  initialData?: BabyProfile | null;
  onSubmitForDialogAndRefetch?: () => void;
};
