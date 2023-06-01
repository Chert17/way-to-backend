import { LikeStatus } from '../../../../utils/like.status';

export class CommentsLikeStatusDbDto {
  readonly commentId: string;
  readonly likeStatus: LikeStatus;
  readonly userId: string;
}
