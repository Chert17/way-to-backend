export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type LikesInputModel = {
  likeStatus: LikeStatus;
};

export type LikeInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
