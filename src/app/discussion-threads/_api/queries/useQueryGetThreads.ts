import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  ApiResponse,
  PaginatedResponse,
  Thread,
  ThreadDetailResponse,
  ThreadReply,
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
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!threadId && enabled,
  });
};

export const useInfiniteQueryGetThreadReplies = ({
  threadId,
  params,
  enabled = true,
}: {
  threadId: string;
  params?: ThreadQueryParams;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["get-thread-replies-infinite", threadId, params],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<ThreadRepliesResponse>(
        `/threads/${threadId}/replies`,
        {
          params: omitEmpty({
            ...(params ?? {}),
            page: pageParam,
          } as Record<string, unknown>),
        }
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.data?.pagination) return undefined;
      const { current_page, last_page } = lastPage.data.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!threadId && enabled,
  });
};

export const useInfiniteQueryGetMyThreads = ({
  params,
}: {
  params?: ThreadQueryParams;
}) => {
  return useInfiniteQuery({
    queryKey: ["get-my-threads-infinite", params],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<Thread>>>(
        "/threads/my",
        {
          params: omitEmpty({
            ...(params ?? {}),
            page: pageParam,
          } as Record<string, unknown>),
        }
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.data?.pagination) return undefined;
      const { current_page, last_page } = lastPage.data.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
export const useQueryGetNestedReplies = ({
  threadId,
  replyId,
  enabled = true,
}: {
  threadId: string;
  replyId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["get-nested-replies", threadId, replyId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ThreadReply[]>>(
        `/threads/${threadId}/replies/${replyId}/replies`
      );
      return res.data;
    },
    enabled: !!threadId && !!replyId && enabled,
  });
};
