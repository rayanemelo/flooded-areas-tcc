import { BACKEND_ROUTES } from "./router";

export type RouteName = keyof typeof BACKEND_ROUTES;

export type Params = Record<string, string | string[] | number | number[]>;

export type PaginatedSearchRequest = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type PaginatedSearchResponse<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
};

export type ErrorDetail = {
  loc: string
  msg: string;
  type: string;
};

export type ErrorResponse = {
  error: string;
  message: string;
  status: number;
  method: string;
  path: string;
  details: Optional<List<ErrorDetail>> | null
}
