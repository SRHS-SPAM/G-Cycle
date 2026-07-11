/**
 * Common API envelope types shared across all endpoints.
 * Backend contract: every response follows { success, data, message } shape.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
