import { ObjectId } from 'mongodb';

import { PostModel } from '../../db/schema-model/post.schema.model';
import { converterPost } from '../../helpers/converterToValidFormatData/converter.post';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export class PostQueryRepo {
  async getAllPosts(
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    const filter = {};

    return await this._getPosts(filter, pagination);
  }

  async getPostById(id: string): Promise<PostViewModel | null> {
    try {
      if (!ObjectId.isValid(id)) return null;

      const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean();

      if (!post) return null;

      return converterPost(post);
    } catch (error) {
      return null;
    }
  }

  async getAllPostsByOneBlog(
    blogId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    const filter = { blogId };

    return await this._getPosts(filter, pagination);
  }

  private async _getPosts(
    filter: Record<string, unknown>,
    pagination: ValidPaginationQueryParams
  ) {
    const { page, pageSize, sortBy, sortDirection } = pagination;

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
  }
}
