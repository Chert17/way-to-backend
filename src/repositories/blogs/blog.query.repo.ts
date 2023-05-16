import { ObjectId } from 'mongodb';

import { BlogModel } from '../../db/schema-model/blog.schema.model';
import { converterBlog } from '../../helpers/converterToValidFormatData/converter.blog';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export class BlogQueryRepo {
  async getAllBlogs(
    condition: string | null,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<BlogViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const find = !condition
      ? {}
      : { name: { $regex: condition, $options: 'i' } };

    const blogs = await BlogModel.find(find)
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await BlogModel.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: blogs.map(converterBlog),
    };
  }

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    try {
      if (!ObjectId.isValid(id)) return null;

      const blog = await BlogModel.findOne({ _id: new ObjectId(id) }).lean();

      if (!blog) return null;

      return converterBlog(blog);
    } catch (error) {
      return null;
    }
  }
}
