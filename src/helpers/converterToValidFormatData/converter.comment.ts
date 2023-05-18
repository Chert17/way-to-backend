import { WithId } from 'mongodb';

import { ICommentsDb } from '../../db/db.types';
import { CommentViewModel } from '../../models/comments.models';
import { LikeStatus } from '../../models/likes.models';

export const converterComment = (
  comment: WithId<ICommentsDb>,
  userId?: string
): CommentViewModel => {
  const { _id, commentatorInfo, content, createdAt, likesInfo } = comment;

  let likesCount = 0;
  let dislikesCount = 0;
  let myStatus = LikeStatus.None;

  likesInfo.forEach(i => {
    if (userId && i.userId === userId) myStatus = i.status;

    if (i.status === LikeStatus.Like) likesCount += 1;

    if (i.status === LikeStatus.Dislike) dislikesCount += 1;
  });

  return {
    id: _id.toString(),
    content: content,
    commentatorInfo: {
      userId: commentatorInfo.userId,
      userLogin: commentatorInfo.userLogin,
    },
    createdAt: createdAt,
    likesInfo: {
      dislikesCount: dislikesCount,
      likesCount: likesCount,
      myStatus: myStatus,
    },
  };
};
