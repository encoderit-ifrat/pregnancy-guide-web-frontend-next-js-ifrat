import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQueryBenefits = ({ page = 1, limit = 12 }: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["benefits", page, limit],
    queryFn: async () => {
      const res = await api.get("/benefits", { params: { page, limit } });
      return res.data;
    },
  });
};
