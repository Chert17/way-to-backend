import { LikeInfoViewModel } from 'src/types/like.info.interface';

class CommentatorInfo {
  readonly userId: string;
  readonly userLogin: string;
}

export class CommentViewDto {
  readonly id: string;
  readonly content: string;
  readonly commentatorInfo: CommentatorInfo;
  readonly createdAt: string;
  readonly likesInfo: LikeInfoViewModel;
}
