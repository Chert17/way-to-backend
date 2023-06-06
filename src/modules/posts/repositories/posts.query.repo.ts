import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { WithPagination } from '../../../types/pagination.interface';
import { ReqUserIdType } from '../../../types/req.user.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { LikeStatus } from '../../../utils/like.status';
import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { PostViewDto } from '../dto/view/post.view.dto';
import { Post } from '../posts.schema';

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAllPosts(
    pagination: PostQueryPagination,
    userId: ReqUserIdType,
  ): Promise<WithPagination<PostViewDto>> {
    const filter = {};

    return await this._getPosts(filter, pagination, userId);
  }

  async getPostById(
    postId: string,
    userId: ReqUserIdType,
  ): Promise<PostViewDto | false> {
    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const post = await this.postModel.findById(convertId).lean();

    return !post ? false : this._postMapping(post, userId);
  }

  async getAllPostsByBlogId(
    blogId: string,
    pagination: PostQueryPagination,
    userId: ReqUserIdType,
  ): Promise<WithPagination<PostViewDto>> {
    const filter = { blogId };

    return await this._getPosts(filter, pagination, userId);
  }

  private async _getPosts(
    filter: Record<string, unknown>,
    pagination: PostQueryPagination,
    userId: ReqUserIdType,
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
      items: posts.map(post => this._postMapping(post, userId)),
    };
  }

  private _postMapping(post: DbType<Post>, userId: ReqUserIdType): PostViewDto {
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

    extendedLikesInfo.forEach(i => {
      if (i.isBanned) return;

      if (userId && i.userId === userId) myStatus = i.status;

      if (i.status === LikeStatus.Like) likesCount += 1;

      if (i.status === LikeStatus.Dislike) dislikesCount += 1;
    });

    const newestLikes = extendedLikesInfo
      .filter(i => i.status === LikeStatus.Like && !i.isBanned)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .splice(0, 3)
      .map(i => ({
        addedAt: i.createdAt.toISOString(),
        userId: i.userId,
        login: i.userLogin,
      }));

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
