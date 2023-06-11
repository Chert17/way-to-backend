import { LikeStatus } from 'src/utils/like.status';

export type LikesInputModel = {
  likeStatus: LikeStatus;
};

export type LikeInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
