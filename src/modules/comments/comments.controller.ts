import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { CommentsQueryRepo } from './repositories/comments.query.repo';

@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CommentsQueryRepo) private commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get('/:id')
  async getCommentById(@Param() commentId: string) {
    const comment = await this.commentsQueryRepo.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    return comment;
  }
}
