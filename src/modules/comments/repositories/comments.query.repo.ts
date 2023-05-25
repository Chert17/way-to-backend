import { Model } from 'mongoose';
import { DbType } from 'src/types/db.interface';
import { tryConvertToObjectId } from 'src/utils/converter.object.id';
import { LikeStatus } from 'src/utils/like.status';
import { CommentQueryPagination } from 'src/utils/pagination/pagination';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

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
      items: posts.map(this._commentMapping),
    };
  }

  async getCommentById(commentId: string): Promise<false | CommentViewDto> {
    const convertId = tryConvertToObjectId(commentId);

    if (!convertId) return false;

    const comment = await this.commentModel.findById(convertId).lean();

    return !comment ? false : this._commentMapping(comment);
  }

  private _commentMapping(comment: DbType<Comment>): CommentViewDto {
    const { _id, commentatorInfo, content, createdAt } = comment;

    let likesCount = 0;
    let dislikesCount = 0;
    let myStatus = LikeStatus.None;

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
