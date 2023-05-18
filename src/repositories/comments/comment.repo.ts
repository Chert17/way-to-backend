import { ObjectId, WithId } from 'mongodb';

import { ICommentsDb, ICommentsLikesInfoDb } from '../../db/db.types';
import { CommentModel } from '../../db/schema-model/comment.schema.modek';
import { LikeStatus } from '../../models/likes.models';

export class CommentRepo {
  async createComment(
    comment: ICommentsDb
  ): Promise<WithId<ICommentsDb> | null> {
    try {
      const result = await CommentModel.create(comment);

      return result;
    } catch (error) {
      return null;
    }
  }

  async updateComment(
    commentId: string,
    content: string
  ): Promise<WithId<ICommentsDb> | null> {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return result;
  }

  async updateCommentLikeInfo(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ): Promise<void | null> {
    try {
      if (!ObjectId.isValid(commentId)) return null;

      const comment = await CommentModel.findById(commentId);

      if (!comment) return null;

      const commentInstance = new CommentModel(comment);
      const { likesInfo } = commentInstance;

      this._checkAndChangeLikeStatus(
        likesInfo,
        likeStatus,
        userId,
        LikeStatus.Dislike
      );

      this._checkAndChangeLikeStatus(
        likesInfo,
        likeStatus,
        userId,
        LikeStatus.Like
      );

      this._checkAndChangeLikeStatus(
        likesInfo,
        likeStatus,
        userId,
        LikeStatus.None
      );

      if (!commentInstance.likesInfo.find(i => i.userId === userId)) {
        commentInstance.likesInfo.push({ userId, status: likeStatus });
      }

      await commentInstance.save();
    } catch (error) {
      return null;
    }
  }

  async deleteComment(commentId: string): Promise<WithId<ICommentsDb> | null> {
    if (!ObjectId.isValid(commentId)) return null;

    const result = await CommentModel.findOneAndDelete({
      _id: new ObjectId(commentId),
    });

    if (!result) return null;

    return result;
  }

  private _checkAndChangeLikeStatus(
    likesInfo: ICommentsLikesInfoDb[],
    inputStatus: LikeStatus,
    userId: string,
    checkStatus: LikeStatus
  ) {
    if (inputStatus === checkStatus) {
      likesInfo.map(i => {
        if (i.userId === userId && i.status === checkStatus) return;

        if (i.userId === userId) {
          i.status = inputStatus;
        }
      });
    }
  }
}
