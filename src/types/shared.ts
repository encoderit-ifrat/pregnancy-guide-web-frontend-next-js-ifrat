// Shared types used across multiple components

export type MetaDetails = {
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  metaKeywords?: string[];
};

export type Benefit = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  content?: string;
  status: "published" | "draft";
};

export type Category = {
  _id: string;
  slug: string;
  name: string;
  metaDetails?: MetaDetails | null;
};

export type Tag = {
  _id: string;
  name: string;
  slug: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  categories: Category[];
  tags: Tag[];
  status: "published" | "draft" | "archived";
  cover_image: string;
  thumbnail_image?: string;
  featured: boolean;
  week?: number;
  track?: string;
  metaDetails?: MetaDetails | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};
