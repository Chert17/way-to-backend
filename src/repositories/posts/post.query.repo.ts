import { ObjectId } from 'mongodb';

import { PostModel } from '../../db/schema-model/post.schema.model';
import { converterPost } from '../../helpers/converterToValidFormatData/converter.post';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const postQueryRepo = {
  async getAllPosts(
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const posts = await PostModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments();

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: posts.map(converterPost),
    };
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean();

      if (!post) return null;

      return converterPost(post);
    } catch (error) {
      return null;
    }
  },

  async getAllPostsByOneBlog(
    blogId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const filter = { blogId };
    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: posts.map(converterPost),
    };
  },
};
