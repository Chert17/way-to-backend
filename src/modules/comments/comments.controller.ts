import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../infra/decorators/params/req.user.decorator';
import { UserId } from '../../infra/decorators/params/req.userId.decorator';
import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/userId.from.token.guard';
import { LikeStatusDto } from '../../types/like.info.interface';
import { ReqUserIdType } from '../../types/req.user.interface';
import { User } from '../users/entities/user.entity';
import { CommentsQueryRepo } from './repositories/comment.query.repo';
import { SetLikeInfoByCommentCommand } from './use-case/comment.like.info.use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get('/:commentId')
  @UseGuards(UserIdFromToken)
  async getCommentById(
    @Param('commentId') commentId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    const comment = await this.commentsQueryRepo.getCommentById(
      commentId,
      userId,
    );

    if (!comment) throw new NotFoundException();

    return comment;
  }

  @Put('/:commentId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  setCommentLikeInfo(
    @Param('commentId') commentId: string,
    @Body() dto: LikeStatusDto,
    @ReqUser() user: User,
  ) {
    return this.commandBus.execute(
      new SetLikeInfoByCommentCommand({
        userId: user.id,
        commentId,
        likeStatus: dto.likeStatus,
      }),
    );
  }
}
