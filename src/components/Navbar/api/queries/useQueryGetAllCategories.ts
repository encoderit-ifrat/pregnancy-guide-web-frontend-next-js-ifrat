import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/providers/I18nProvider";

export const useQueryGetAllCategories = () => {
  const { locale } = useTranslation();
  return useQuery({
    queryKey: ["get-all-my-categories", locale],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });
};
