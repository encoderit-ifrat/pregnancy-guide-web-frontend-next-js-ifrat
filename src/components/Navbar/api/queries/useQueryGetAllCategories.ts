import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllCategories = () => {
  return useQuery({
    queryKey: ["get-all-my-categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });
};
