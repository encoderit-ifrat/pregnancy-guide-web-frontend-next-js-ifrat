import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ApiResponse,
  PaginatedResponse,
  Thread,
  ThreadDetailResponse,
  ThreadRepliesResponse,
  ThreadQueryParams,
} from "../../_types/thread_types";

export const useQueryGetThreads = ({
  params,
}: {
  params?: ThreadQueryParams;
}) => {
  return useQuery({
    queryKey: ["get-threads", params],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Thread>>>(
        "/threads",
        {
          params: omitEmpty((params ?? {}) as Record<string, unknown>),
        }
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useQueryGetMyThreads = ({
  params,
}: {
  params?: ThreadQueryParams;
}) => {
  return useQuery({
    queryKey: ["get-my-threads", params],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Thread>>>(
        "/threads/my",
        {
          params: omitEmpty((params ?? {}) as Record<string, unknown>),
        }
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useQueryGetThreadDetail = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["get-thread-detail", id],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<ThreadDetailResponse>(`/threads/${id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!id && enabled,
  });
};

export const useQueryGetThreadReplies = ({
  threadId,
  params,
  enabled = true,
}: {
  threadId: string;
  params?: ThreadQueryParams;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["get-thread-replies", threadId, params],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<ThreadRepliesResponse>(
        `/threads/${threadId}/replies`,
        {
          params: omitEmpty((params ?? {}) as Record<string, unknown>),
        }
      );
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!threadId && enabled,
  });
};
