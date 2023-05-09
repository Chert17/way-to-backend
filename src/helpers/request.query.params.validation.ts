import {
  PaginationQueryParams,
  ValidPaginationQueryParams,
} from '../types/req-res.types';

export const paginationQueryParamsValidation = (
  params: PaginationQueryParams
): ValidPaginationQueryParams => {
  const { pageNumber, pageSize, sortBy, sortDirection } = params;

  const validParams: ValidPaginationQueryParams = {
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  };

  if (sortBy && sortBy.trim()) {
    validParams.sortBy = sortBy;
  }

  if (sortDirection === 'asc' || sortDirection === 'desc') {
    validParams.sortDirection = sortDirection;
  }

  if (pageNumber && !isNaN(+pageNumber)) {
    validParams.page = parseInt(pageNumber);
  }

  if (pageSize && !isNaN(+pageSize)) {
    validParams.pageSize = parseInt(pageSize);
  }

  return validParams;
};
