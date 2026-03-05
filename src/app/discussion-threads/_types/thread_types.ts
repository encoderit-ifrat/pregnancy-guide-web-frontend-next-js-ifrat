export interface ThreadAuthor {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Thread {
  _id: string;
  title: string;
  description: string;
  author: ThreadAuthor;
  likes: string[];
  likes_count: number;
  views_count: number;
  replies_count: number;
  flags: string[];
  flags_count?: number;
  is_flagged?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ThreadReply {
  _id: string;
  thread: string;
  content: string;
  author: ThreadAuthor;
  likes: string[];
  likes_count: number;
  flags: string[];
  flags_count?: number;
  is_flagged?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ThreadDetailResponse = ApiResponse<Thread>;

export type ThreadRepliesResponse = ApiResponse<PaginatedResponse<ThreadReply>>;

export interface CreateThreadDto {
  title: string;
  description: string;
}

export interface UpdateThreadDto {
  title?: string;
  description?: string;
}

export interface CreateThreadReplyDto {
  content: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likes_count: number;
}

export interface FlagResponse {
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export type ThreadSortOption = "newest" | "most_liked" | "most_viewed";

export interface ThreadQueryParams {
  sort?: ThreadSortOption;
  page?: string | number;
  limit?: string | number;
}

export interface ThreadRepliesQueryParams {
  sort?: ThreadSortOption;
  page?: string | number;
  limit?: string | number;
}

export interface PusherNewThreadEvent {
  thread: Thread;
}

export interface PusherThreadDeletedEvent {
  thread_id: string;
}

export interface PusherThreadLikedEvent {
  thread_id: string;
  liked: boolean;
  likes_count: number;
}

export interface PusherNewReplyEvent {
  reply: ThreadReply;
  replies_count: number;
}

export interface PusherReplyLikedEvent {
  reply_id: string;
  liked: boolean;
  likes_count: number;
}

export interface PusherReplyDeletedEvent {
  reply_id: string;
}
