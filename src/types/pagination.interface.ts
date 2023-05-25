// export interface QueryPagination {
//   condition?: string;
//   sortBy?: string;
//   sortDirection?: 'asc' | 'desc';
//   pageNumber?: string;
//   pageSize?: string;
// }

// export interface Pagination {
//   condition: string | null;
//   sortBy: string;
//   sortDirection: 'asc' | 'desc';
//   page: number;
//   pageSize: number;
// }

export interface WithPagination<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
