import { LikeStatus } from '../../../utils/like.status';

export class CommentsLikeStatusServiceDto {
  readonly commentId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
}

export class CommentsLikeStatusDbDto {
  readonly commentId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
