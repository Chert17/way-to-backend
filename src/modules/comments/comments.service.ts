import { Injectable } from '@nestjs/common';

import { MongoId } from '../../types/mongo._id.interface';
import { Comment } from './comments.schema';
import { CommentsLikeStatusDbDto } from './dto/input/comment.like.status.db';
import { CreateCommentServiceDto } from './dto/input/create.comment.dto';
import { updateCommentDto } from './dto/input/update.comment.dto';
import { CommentsRepo } from './repositories/comments.repo';

@Injectable()
export class CommentsService {
  constructor(private commentsRepo: CommentsRepo) {}

  async createComment(dto: CreateCommentServiceDto): Promise<MongoId> {
    const { postId, content, userId, userLogin } = dto;

    const newComment: Comment = {
      postId,
      content,
      commentatorInfo: { userId, userLogin },
      createdAt: new Date().toISOString(),
      likesInfo: [],
    };

    return await this.commentsRepo.createComment(newComment);
  }

  async updateComment(commentId: string, dto: updateCommentDto) {
    const comment = await this.commentsRepo.checkCommentById(commentId);

    if (!comment) return false;

    return await this.commentsRepo.updateComment(commentId, dto.content);
  }

  async updateLikeInfo(dto: CommentsLikeStatusDbDto) {
    const comment = await this.commentsRepo.checkCommentById(dto.commentId);

    if (!comment) return false;

    return await this.commentsRepo.updateLikeInfo(dto);
  }

  async deleteComment(commentId: string) {
    const comment = await this.commentsRepo.checkCommentById(commentId);

    if (!comment) return false;

    return await this.commentsRepo.deleteComment(commentId);
  }
}
