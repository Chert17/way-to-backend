import { LikeStatus } from '../../../utils/like.status';

export class AllCommentsByBloggerBlogViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: 0;
    dislikesCount: 0;
    myStatus: LikeStatus;
  };
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
}
