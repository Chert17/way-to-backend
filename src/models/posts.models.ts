import { LikeInfoViewModel } from './likes.models';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikeInfoViewModel & { newestLikes: NewestLikes[] };
};
