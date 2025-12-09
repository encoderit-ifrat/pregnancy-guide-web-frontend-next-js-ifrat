import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllAnswers = ({
  params,
}: {
  params?: {
    id: string;
    timestamp?: string | null;
    page?: string;
  };
}) => {
  return useQuery({
    queryKey: ["get-all-questions-answer", params],
    refetchOnMount: true,
    staleTime: 0,
    enabled: !!params?.id,
    queryFn: async () => {
      const res = await api.get(`/questions/${params?.id}/answers`, {
        params: omitEmpty({ page: params?.page }),
      });
      return res.data;
    },
  });
};
