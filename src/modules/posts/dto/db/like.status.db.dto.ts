import { LikeStatus } from '../../../../utils/like.status';

export class LikeStatusDbDto {
  readonly postId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
  readonly userLogin: string;
}
