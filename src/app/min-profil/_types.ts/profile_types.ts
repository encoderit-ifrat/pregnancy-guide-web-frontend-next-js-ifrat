export interface FormData {
  babyName: string;
  gender: string;
  dueDate: string;
  motherName: string;
  lastPeriodDate: string;
  dob: string;
  weight: string;
  height: string;
}

export interface BabyProfile {
  _id: string;
  name?: string;
  avatar?: string;
  upcoming: boolean;
  gender?: string;
  dob?: string;
  dueDate?: string;
  due_date?: string;
  lastPeriodDate?: string;
  last_period_date?: string;
  current_pregnancy_week?: string;
  weight?: string;
  height?: string;
}

export interface ProfileDetail {
  key: string;
  label: string;
  value: string;
}

import { FormProfileProps } from "./profile_form_types";

export type { FormProfileProps };
