import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateCommentServiceDto } from '../dto/update.comment.dto';
import { CommentsRepo } from '../repositories/comment.repo';

export class UpdateCommentCommand {
  constructor(public dto: UpdateCommentServiceDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepo: CommentsRepo) {}

  async execute({ dto }: UpdateCommentCommand) {
    const { userId, commentId, content } = dto;

    const comment = await this.commentsRepo.checkCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.user_id !== userId) throw new ForbiddenException();

    return this.commentsRepo.updateComment({ commentId, content });
  }
}
