import { WithId } from 'mongodb';

import { ICommentsDb } from '../../db/db.types';
import { CommentViewModel } from '../../models/comments.models';

export const converterComment = (
  comment: WithId<ICommentsDb>
): CommentViewModel => ({
  id: comment._id.toString(),
  content: comment.content,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  createdAt: comment.createdAt,
});
