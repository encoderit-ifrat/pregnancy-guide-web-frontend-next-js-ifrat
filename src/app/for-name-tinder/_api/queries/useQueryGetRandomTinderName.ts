import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type TinderNameGender = "male" | "female" | "unisex";

export interface TinderName {
  id: string | number;
  name: string;
  meaning?: string;
  origin?: string;
  [key: string]: unknown;
}

export interface TinderNameResponse {
  data: TinderName[];
  [key: string]: unknown;
}

export interface UseQueryGetRandomTinderNameParams {
  gender: TinderNameGender;
  category_id: string;
  enabled?: boolean;
}

export const useQueryGetRandomTinderName = ({
  gender,
  category_id,
  enabled = true,
}: UseQueryGetRandomTinderNameParams) => {
  return useQuery({
    queryKey: ["tinder-names-random", gender, category_id],
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await api.get<TinderNameResponse>("/tinder-names/random", {
        params: { gender, category_id },
      });
      return res.data;
    },
    enabled: !!gender && !!category_id && enabled,
  });
};
