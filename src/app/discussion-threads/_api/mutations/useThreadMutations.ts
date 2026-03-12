import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import {
  ApiResponse,
  CreateThreadDto,
  CreateThreadReplyDto,
  DeleteResponse,
  FlagResponse,
  Thread,
  ThreadDetailResponse,
  ThreadReply,
  ToggleLikeResponse,
  ShareResponse,
  UpdateThreadDto,
} from "../../_types/thread_types";

export const useMutationCreateThread = () => {
  return useMutation({
    mutationKey: ["create-thread"],
    mutationFn: (body: CreateThreadDto) => api.post<Thread>("/threads", body),
  });
};

export const useMutationUpdateThread = () => {
  return useMutation({
    mutationKey: ["update-thread"],
    mutationFn: ({ id, body }: { id: string; body: UpdateThreadDto }) =>
      api.patch<ThreadDetailResponse>(`/threads/${id}`, body),
  });
};

export const useMutationDeleteThread = () => {
  return useMutation({
    mutationKey: ["delete-thread"],
    mutationFn: (id: string) => api.delete<DeleteResponse>(`/threads/${id}`),
  });
};

export const useMutationToggleThreadLike = () => {
  return useMutation({
    mutationKey: ["toggle-thread-like"],
    mutationFn: (id: string) =>
      api.post<ToggleLikeResponse>(`/threads/${id}/like`),
  });
};

export const useMutationFlagThread = () => {
  return useMutation({
    mutationKey: ["flag-thread"],
    mutationFn: (id: string) => api.post<FlagResponse>(`/threads/${id}/flag`),
  });
};

export const useMutationShareThread = () => {
  return useMutation({
    mutationKey: ["share-thread"],
    mutationFn: (id: string) =>
      api.post<ApiResponse<ShareResponse>>(`/threads/${id}/share`),
  });
};



export const useMutationCreateReply = () => {
  return useMutation({
    mutationKey: ["create-reply"],
    mutationFn: ({
      threadId,
      content,
      parent_reply_id,
    }: {
      threadId: string;
      content: string;
      parent_reply_id?: string;
    }) =>
      api.post<ThreadReply>(`/threads/${threadId}/replies`, {
        content,
        parent_reply_id,
      } as CreateThreadReplyDto),
  });
};

export const useMutationToggleReplyLike = () => {
  return useMutation({
    mutationKey: ["toggle-reply-like"],
    mutationFn: ({
      threadId,
      replyId,
    }: {
      threadId: string;
      replyId: string;
    }) =>
      api.post<ToggleLikeResponse>(
        `/threads/${threadId}/replies/${replyId}/like`
      ),
  });
};

export const useMutationFlagReply = () => {
  return useMutation({
    mutationKey: ["flag-reply"],
    mutationFn: ({
      threadId,
      replyId,
    }: {
      threadId: string;
      replyId: string;
    }) =>
      api.post<FlagResponse>(`/threads/${threadId}/replies/${replyId}/flag`),
  });
};

export const useMutationDeleteReply = () => {
  return useMutation({
    mutationKey: ["delete-reply"],
    mutationFn: ({
      threadId,
      replyId,
    }: {
      threadId: string;
      replyId: string;
    }) => api.delete<DeleteResponse>(`/threads/${threadId}/replies/${replyId}`),
  });
};
