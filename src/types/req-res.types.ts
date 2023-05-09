import { Request } from 'express';

export type TypeRequestBody<T> = Request<{}, {}, T>;
export type TypeRequestParamsAndBody<T, B> = Request<T, {}, B>;
export type TypeRequestParams<T> = Request<T>;
export type TypeRequestQuery<T> = Request<{}, {}, {}, T>;
export type TypeRequestParamsAndQuery<T, B> = Request<T, {}, {}, B>;

export type PaginationQueryParams = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

export type ValidPaginationQueryParams = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
};
