import { LikeStatus } from '../../../../utils/like.status';

export class PostsLikeStatusDbDto {
  readonly postId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
  readonly userLogin: string;
}
