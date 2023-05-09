import { ObjectId } from 'mongodb';

import { commentsDbCollection } from '../../db/db.collections';
import { converterComment } from '../../helpers/converterToValidFormatData/converter.comment';
import { CommentViewModel } from '../../models/comments.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const commentQueryRepo = {
  getAllComments: async (
    postId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<CommentViewModel>> => {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const find = { postId: postId };

    const comments = await commentsDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsDbCollection.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: comments.map(converterComment),
    };
  },

  getCommentById: async (id: string): Promise<CommentViewModel | null> => {
    if (!ObjectId.isValid(id)) return null;

    const comment = await commentsDbCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!comment) return null;

    return converterComment(comment);
  },
};
