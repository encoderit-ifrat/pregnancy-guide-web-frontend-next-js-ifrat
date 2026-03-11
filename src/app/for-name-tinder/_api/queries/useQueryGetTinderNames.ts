import api from "@/lib/axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export interface TinderNameItem {
  _id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  liked_count: number;
  loved_count: number;
  description?: string;
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

export const useInfiniteQueryGetTinderNames = (params?: TinderNamesParams) => {
  return useInfiniteQuery({
    queryKey: ["tinder-names-infinite", params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<TinderNamesResponse>("/tinder-names", {
        params: { ...params, page: pageParam },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.data.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
