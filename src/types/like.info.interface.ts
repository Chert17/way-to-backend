import { LikeStatus } from 'src/utils/like.status';

import { LikeStatusValue } from '../infra/decorators/validation/like.status';

export type LikesInputModel = {
  likeStatus: LikeStatus;
};

export type LikeInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export class LikeStatusDto {
  @LikeStatusValue()
  readonly likeStatus: LikeStatus;
}
