import { ObjectId } from 'mongodb';

import { CommentModel } from '../../db/schema-model/comment.schema.modek';
import { converterComment } from '../../helpers/converterToValidFormatData/converter.comment';
import { CommentViewModel } from '../../models/comments.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export class CommentQueryRepo {
  async getAllComments(
    postId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<CommentViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const find = { postId: postId };

    const comments = await CommentModel.find(find)
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await CommentModel.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: comments.map(item => converterComment(item)),
    };
  }

  async getCommentById(
    id: string,
    userId?: string
  ): Promise<CommentViewModel | null> {
    if (!ObjectId.isValid(id)) return null;

    const comment = await CommentModel.findById({
      _id: new ObjectId(id),
    }).lean();

    if (!comment) return null;

    return converterComment(comment, userId);
  }
}
