import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '../../infra/decorators/param/req.userId.decorator';
import { UserIdFromToken } from '../../infra/guards/auth/userId.from.token.guard';
import { ReqUserId } from '../../types/req.user.interface';
import { CommentsQueryRepo } from './repositories/comments.query.repo';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepo: CommentsQueryRepo) {}

  @Get('/:id')
  @UseGuards(UserIdFromToken)
  async getCommentById(
    @Param() commentId: string,
    @UserId() userId: ReqUserId,
  ) {
    const comment = await this.commentsQueryRepo.getCommentById(
      commentId,
      userId,
    );

    if (!comment) throw new NotFoundException();

    return comment;
  }
}
