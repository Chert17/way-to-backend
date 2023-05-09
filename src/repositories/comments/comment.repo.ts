import { ObjectId, WithId } from 'mongodb';

import { commentsDbCollection } from '../../db/db.collections';
import { ICommentsDb } from '../../db/db.types';

export const commentRepo = {
  createComment: async (newComment: ICommentsDb): Promise<ObjectId | null> => {
    try {
      const result = await commentsDbCollection.insertOne(newComment);

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<WithId<ICommentsDb> | null> => {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await commentsDbCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
      { returnDocument: 'after' }
    );

    if (!result.value) return null;

    return result.value;
  },

  deleteComment: async (
    commentId: string
  ): Promise<WithId<ICommentsDb> | null> => {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await commentsDbCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });

    if (!result.value) return null;

    return result.value;
  },
};
