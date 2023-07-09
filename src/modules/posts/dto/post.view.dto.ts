import { LikeInfoViewModel } from 'src/types/like.info.interface';

import { ImgData } from '../../../types/img.data.interface';

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

export class PostWithImagesViewDto extends PostViewDto {
  readonly images: { main: ImgData[] };
}
