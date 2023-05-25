import { Model } from 'mongoose';
import { DbType } from 'src/types/db.interface';
import { WithPagination } from 'src/types/pagination.interface';
import { tryConvertToObjectId } from 'src/utils/converter.object.id';
import { LikeStatus } from 'src/utils/like.status';
import { PostQueryPagination } from 'src/utils/pagination/pagination';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PostViewDto } from '../dto/view/post.view.dto';
import { Post } from '../posts.schema';

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAllPosts(
    pagination: PostQueryPagination,
  ): Promise<WithPagination<PostViewDto>> {
    const filter = {};

    return await this._getPosts(filter, pagination);
  }

  async getPostById(postId: string): Promise<PostViewDto | false> {
    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const post = await this.postModel.findById(convertId).lean();

    return !post ? false : this._postMapping(post);
  }

  async getAllPostsByBlogId(
    blogId: string,
    pagination: PostQueryPagination,
  ): Promise<WithPagination<PostViewDto>> {
    const filter = { blogId };

    return await this._getPosts(filter, pagination);
  }

  private async _getPosts(
    filter: Record<string, unknown>,
    pagination: PostQueryPagination,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const posts = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.postModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(this._postMapping),
    };
  }

  private _postMapping(post: DbType<Post>): PostViewDto {
    const {
      _id,
      blogId,
      blogName,
      content,
      createdAt,
      extendedLikesInfo,
      shortDescription,
      title,
    } = post;

    let likesCount = 0;
    let dislikesCount = 0;
    let myStatus = LikeStatus.None;

    const newestLikes = extendedLikesInfo
      .filter(i => i.status === LikeStatus.Like)
      .sort(
        (a, b) =>
          // @ts-ignore  //! because I'm add timestamps in schema
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .splice(0, 3)
      // @ts-ignore      //! because I'm add timestamps in schema
      .map(i => ({ addedAt: i.createdAt, userId: i.userId, login: i.login }));

    return {
      id: _id.toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: createdAt.toISOString(),
      extendedLikesInfo: {
        dislikesCount,
        likesCount,
        myStatus,
        newestLikes,
      },
    };
  }
}
