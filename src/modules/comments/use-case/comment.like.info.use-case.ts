import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsLikeStatusServiceDto } from '../dto/comment.like.status';
import { CommentsRepo } from '../repositories/comment.repo';

export class SetLikeInfoByCommentCommand {
  constructor(public dto: CommentsLikeStatusServiceDto) {}
}

@CommandHandler(SetLikeInfoByCommentCommand)
export class SetLikeInfoByCommentUseCase
  implements ICommandHandler<SetLikeInfoByCommentCommand>
{
  constructor(private commentsRepo: CommentsRepo) {}

  async execute({ dto }: SetLikeInfoByCommentCommand) {
    const { userId, commentId, likeStatus } = dto;

    const comment = await this.commentsRepo.checkCommentById(commentId);

    if (!comment) throw new NotFoundException(); // If specified comment doesn't exists

    return this.commentsRepo.setLikeStatus({
      userId,
      commentId,
      likeStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
