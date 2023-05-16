import { ObjectId, WithId } from 'mongodb';

import { ICommentsDb } from '../db/db.types';
import { converterComment } from '../helpers/converterToValidFormatData/converter.comment';
import { CommentViewModel } from '../models/comments.models';
import { commentRepo } from '../repositories/comments/comment.repo';
import { userQueryRepo } from '../repositories/users/user.composition';

export const commentService = {
  createComment: async (
    content: string,
    postId: string,
    userId: string
  ): Promise<CommentViewModel | null> => {
    const user = await userQueryRepo.getUserById(userId);

    if (!user) return null;

    const newComment: ICommentsDb = {
      content,
      postId,
      commentatorInfo: { userId: user.id, userLogin: user.login },
      createdAt: new Date().toISOString(),
    };

    const result = await commentRepo.createComment(newComment);

    return result ? converterComment(result) : null;
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<WithId<ICommentsDb> | null> => {
    return await commentRepo.updateComment(commentId, content);
  },

  deleteComment: async (
    commentId: string
  ): Promise<WithId<ICommentsDb> | null> => {
    return await commentRepo.deleteComment(commentId);
  },
};
