import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { converterPost } from '../../helpers/converterToValidFormatData/converter.post';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const postQueryRepo = {
  async getAllPosts(
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const posts = await postsDbCollection
      .find()
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsDbCollection.countDocuments();

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

      const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

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
    const posts = await postsDbCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsDbCollection.countDocuments(filter);

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
