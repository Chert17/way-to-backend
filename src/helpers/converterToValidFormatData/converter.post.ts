import { WithId } from 'mongodb';

import { IPostDb } from '../../db/db.types';
import { LikeStatus } from '../../models/likes.models';
import { PostViewModel } from '../../models/posts.models';

export const converterPost = (
  post: WithId<IPostDb>,
  userId?: string
): PostViewModel => {
  const {
    _id,
    blogId,
    blogName,
    content,
    createdAt,
    extendedLikesInfo,
    shortDescription,
    title,
  } = post;

  let likesCount = 0;
  let dislikesCount = 0;
  let myStatus = LikeStatus.None;

  extendedLikesInfo.forEach(i => {
    if (userId && i.userId === userId) myStatus = i.status;

    if (i.status === LikeStatus.Like) likesCount += 1;

    if (i.status === LikeStatus.Dislike) dislikesCount += 1;
  });

  const newestLikes = extendedLikesInfo
    .filter(i => i.status === LikeStatus.Like)
    .sort(
      (a, b) =>
        // @ts-ignore
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .splice(0, 3)
    // @ts-ignore
    .map(i => ({ addedAt: i.createdAt, userId: i.userId, login: i.login }));

  return {
    id: _id.toString(),
    title: title,
    shortDescription: shortDescription,
    content: content,
    blogId: blogId,
    blogName: blogName,
    createdAt: createdAt,
    extendedLikesInfo: {
      dislikesCount: dislikesCount,
      likesCount: likesCount,
      myStatus: myStatus,
      newestLikes: newestLikes,
    },
  };
};
