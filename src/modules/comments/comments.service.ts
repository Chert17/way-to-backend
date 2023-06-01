import { Injectable } from '@nestjs/common';

import { LikeStatus } from '../../utils/like.status';
import { Comment } from './comments.schema';
import { CreateCommentServiceDto } from './dto/input/create.comment.dto';
import { CommentsRepo } from './repositories/comments.repo';

@Injectable()
export class CommentsService {
  constructor(private commentsRepo: CommentsRepo) {}

  async createComment(dto: CreateCommentServiceDto) {
    const { postId, content, userId, userLogin } = dto;

    const newComment: Comment = {
      postId,
      content,
      commentatorInfo: { userId, userLogin },
      createdAt: new Date().toISOString(),
      likesInfo: [{ userId, status: LikeStatus.None }],
    };

    return await this.commentsRepo.createComment(newComment);
  }
}
