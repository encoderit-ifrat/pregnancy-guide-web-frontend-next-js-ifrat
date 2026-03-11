import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface TinderNameItem {
  _id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  liked_count: number;
  loved_count: number;
  category_id: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  [key: string]: unknown;
}

interface TinderNamesResponse {
  success: boolean;
  message: string;
  data: {
    data: TinderNameItem[];
    pagination: Pagination;
  };
}

export interface TinderNamesParams {
  sort?: string;
  page?: number;
  [key: string]: unknown;
}

export const useQueryGetTinderNames = (params?: TinderNamesParams) => {
  return useQuery({
    queryKey: ["tinder-names", params],
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await api.get<TinderNamesResponse>("/tinder-names", {
        params,
      });
      return res.data;
    },
  });
};
