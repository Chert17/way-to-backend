import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { ReqUserIdType } from '../../../types/req.user.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { LikeStatus } from '../../../utils/like.status';
import { CommentQueryPagination } from '../../../utils/pagination/pagination';
import { Comment } from '../comments.schema';
import { CommentViewDto } from '../dto/view/comment.view.dto';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getAllCommentsByPostId(
    postId: string,
    pagination: CommentQueryPagination,
    userId: ReqUserIdType,
  ) {
    const filter = { postId };

    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const posts = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(comment => this._commentMapping(comment, userId)),
    };
  }

  async getCommentById(
    commentId: string,
    userId: ReqUserIdType,
  ): Promise<false | CommentViewDto> {
    const convertId = tryConvertToObjectId(commentId);

    if (!convertId) return false;

    const comment = await this.commentModel
      .findById({ _id: convertId }, { 'commentatorInfo.isBanned': false })
      .lean();

    return !comment ? false : this._commentMapping(comment, userId);
  }

  private _commentMapping(
    comment: DbType<Comment>,
    userId: ReqUserIdType,
  ): CommentViewDto {
    const { _id, commentatorInfo, content, createdAt, likesInfo } = comment;

    let likesCount = 0;
    let dislikesCount = 0;
    let myStatus = LikeStatus.None;

    likesInfo.forEach(i => {
      if (i.isBanned) return;

      if (userId && i.userId === userId) myStatus = i.status;

      if (i.status === LikeStatus.Like) likesCount += 1;

      if (i.status === LikeStatus.Dislike) dislikesCount += 1;
    });

    return {
      id: _id.toString(),
      content,
      commentatorInfo: {
        userId: commentatorInfo.userId,
        userLogin: commentatorInfo.userLogin,
      },
      createdAt,
      likesInfo: {
        dislikesCount,
        likesCount,
        myStatus,
      },
    };
  }
}
