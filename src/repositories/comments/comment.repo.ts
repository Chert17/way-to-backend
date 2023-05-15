import { ObjectId, WithId } from 'mongodb';

import { ICommentsDb } from '../../db/db.types';
import { CommentModel } from '../../db/schema-model/comment.schema.modek';

export const commentRepo = {
  createComment: async (
    comment: ICommentsDb
  ): Promise<WithId<ICommentsDb> | null> => {
    try {
      return await CommentModel.create(comment);
    } catch (error) {
      return null;
    }
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<WithId<ICommentsDb> | null> => {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return result;
  },

  deleteComment: async (
    commentId: string
  ): Promise<WithId<ICommentsDb> | null> => {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await CommentModel.findOneAndDelete({
      _id: new ObjectId(commentId),
    });

    if (!result) return null;

    return result;
  },
};
