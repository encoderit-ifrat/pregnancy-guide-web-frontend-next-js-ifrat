import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type MatchingFilter = "all" | "liked" | "loved";
export type Gender = "male" | "female" | "unisex";
export type MatchingType = {
  _id: string;
  name: string;
  gender: Gender;
  liked_count: number;
  loved_count: number;
  category_id: {
    _id: string;
    name: string;
    slug: string;
    id: string;
  };
  description?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface MatchingNameItem {
  _id: string;
  user_id: string;
  partner_id: string;
  liked: MatchingType[];
  loved: MatchingType[];
}

interface MatchingNamesResponse {
  success: boolean;
  message: string;
  data: MatchingNameItem | MatchingNameItem[];
}

export const useQueryGetMatchingNames = (
  filter: MatchingFilter = "all",
  user_id?: string,
  partner_id?: string,
  isPublic: boolean = false,
  initialData?: any
) => {
  return useQuery({
    queryKey: ["tinder-names-matching", filter, user_id, partner_id, isPublic],
    staleTime: 0,
    refetchOnWindowFocus: false,
    initialData: initialData,
    queryFn: async () => {
      const endpoint = isPublic
        ? "/tinder-names/matching/public"
        : "/tinder-names/matching";
      const res = await api.get<MatchingNamesResponse>(endpoint, {
        params: { filter, user_id, partner_id },
      });
      // Normalise: API may return a single object or an array
      const raw = res.data.data;
      const items: MatchingNameItem[] = Array.isArray(raw) ? raw : [raw];
      return { ...res.data, items };
    },
  });
};
