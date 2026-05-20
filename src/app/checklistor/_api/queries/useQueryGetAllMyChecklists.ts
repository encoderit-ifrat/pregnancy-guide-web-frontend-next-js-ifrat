import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAllMyChecklists = ({
  params,
}: {
  params?: { id?: string; page?: string; limit?: string };
}) => {
  return useQuery({
    queryKey: ["get-all-my-checklists", params?.id, params?.page, params?.limit],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get("/my/checklists", {
        params: omitEmpty(params ?? {}),
      });
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useQueryGetAllMyCompletedChecklists = ({
  params,
}: {
  params?: { id?: string; page?: string; limit?: string };
}) => {
  return useQuery({
    queryKey: ["get-all-my-completed-checklists", params?.id, params?.page, params?.limit],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get("/my/checklists/complete", {
        params: omitEmpty(params ?? {}),
      });
      return res.data.data;
    },
  });
};
