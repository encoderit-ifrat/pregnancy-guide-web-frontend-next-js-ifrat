import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface TinderNameCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: string;
  order: number;
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

interface TinderNameCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    data: TinderNameCategory[];
    pagination: Pagination;
  };
}

export const useQueryGetTinderNameCategories = () => {
  return useQuery({
    queryKey: ["tinder-name-categories"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await api.get<TinderNameCategoriesResponse>(
        "/tinder-name-categories"
      );
      return res.data;
    },
  });
};
