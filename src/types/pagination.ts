/**
 * Laravel-style pagination envelope returned by the Familj backend
 * `paginate()` helper. Shared by the new feature modules.
 */
export interface LaravelPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;
  first_page_url: string | null;
  prev_page_url: string | null;
  next_page_url: string | null;
  last_page_url: string | null;
  path: string | null;
}

export interface Paginated<T> {
  data: T[];
  pagination: LaravelPagination;
  summary?: any;
}
