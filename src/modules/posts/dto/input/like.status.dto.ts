import { LikeStatusValue } from '../../../../infra/decorators/validation/like.status.decorator';
import { LikeStatus } from '../../../../utils/like.status';

export class LikeStatusDto {
  @LikeStatusValue()
  readonly likeStatus: LikeStatus;
}
