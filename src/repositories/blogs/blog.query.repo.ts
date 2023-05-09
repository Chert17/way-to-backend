import { ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { converterBlog } from '../../helpers/converterToValidFormatData/converter.blog';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const blogQueryRepo = {
  getAllBlogs: async (
    condition: string | null,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<BlogViewModel>> => {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const find = !condition
      ? {}
      : { name: { $regex: condition, $options: 'i' } };

    const blogs = await blogsDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsDbCollection.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: blogs.map(converterBlog),
    };
  },

  getBlogById: async (id: string): Promise<BlogViewModel | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

      if (!blog) return null;

      return converterBlog(blog);
    } catch (error) {
      return null;
    }
  },
};
