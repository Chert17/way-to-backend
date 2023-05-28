import { LikeInfoViewModel } from 'src/types/like.info.interface';
import { LikeStatus } from 'src/utils/like.status';

export class PostViewDto {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
  readonly blogId: string;
  readonly blogName: string;
  readonly createdAt: string;
  readonly extendedLikesInfo: LikeInfoViewModel & {
    newestLikes: NewestLikes[];
  };
}

class NewestLikes {
  readonly addedAt: string;
  readonly userId: string;
  readonly login: string;
}
