import { LikeStatus } from '../../../utils/like.status';

export class PostsLikeStatusServiceDto {
  readonly postId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
}

export class PostsLikeStatusDbDto {
  readonly postId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
