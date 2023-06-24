import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepo } from '../repositories/comment.repo';

export class DeleteCommentCommand {
  constructor(public userId: string, public commentId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepo: CommentsRepo) {}

  async execute({ userId, commentId }: DeleteCommentCommand) {
    const comment = await this.commentsRepo.checkCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.user_id !== userId) throw new ForbiddenException();

    return this.commentsRepo.deleteComment(commentId);
  }
}
