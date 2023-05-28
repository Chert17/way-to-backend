import { Injectable } from '@nestjs/common';

import { LikeStatus } from '../../utils/like.status';
import { Comment } from './comments.schema';
import { CreateCommentDto } from './dto/input/create.comment.dto';
import { CommentsRepo } from './repositories/comments.repo';

@Injectable()
export class CommentsService {
  constructor(private commentsRepo: CommentsRepo) {}

  async createComment(dto: CreateCommentDto) {
    const newComment: Comment = {
      content: dto.content,
      postId: dto.postId,
      commentatorInfo: { userId: 'string', userLogin: 'string' },
      createdAt: new Date().toISOString(),
      likesInfo: [{ userId: 'string', status: LikeStatus.None }],
    };

    return await this.commentsRepo.createComment(newComment);
  }
}
