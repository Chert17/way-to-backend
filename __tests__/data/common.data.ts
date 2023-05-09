import { ObjectId } from 'mongodb';

export const invalidId = new ObjectId(-123);

export const paginationData = {
  pagesCount: 1,
  pageSize: 10,
  page: 1,
  totalCount: 1,
  items: [],
};
