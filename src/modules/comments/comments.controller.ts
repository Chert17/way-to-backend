import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ReqUser } from '../../infra/decorators/param/req.user.decorator';
import { UserId } from '../../infra/decorators/param/req.userId.decorator';
import { JwtAuthGuard } from '../../infra/guards/auth/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/auth/userId.from.token.guard';
import { CanUserWorkWithComment } from '../../infra/guards/comments/can.user.work.with.comment.guard';
import { DbType } from '../../types/db.interface';
import { LikeStatusDto } from '../../types/like.info.interface';
import { ReqUserIdType } from '../../types/req.user.interface';
import { User } from '../users/schemas/users.schema';
import { CommentsService } from './comments.service';
import { updateCommentDto } from './dto/input/update.comment.dto';
import { CommentsQueryRepo } from './repositories/comments.query.repo';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepo: CommentsQueryRepo,
    private commentsService: CommentsService,
  ) {}

  @Get('/:id')
  @UseGuards(UserIdFromToken)
  async getCommentById(
    @Param() commentId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    const comment = await this.commentsQueryRepo.getCommentById(
      commentId,
      userId,
    );

    if (!comment) throw new NotFoundException();

    return comment;
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, CanUserWorkWithComment)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param() commentId: string,
    @Body() dto: updateCommentDto,
  ) {
    const result = await this.commentsService.updateComment(commentId, dto);

    if (!result) throw new NotFoundException();

    return;
  }

  @Put('/:commentId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentLikeInfo(
    @Param('commentId') commentId: string,
    @Body() dto: LikeStatusDto,
    @ReqUser() user: DbType<User>,
  ) {
    const result = await this.commentsService.updateLikeInfo({
      commentId,
      likeStatus: dto.likeStatus,
      userId: user._id.toString(),
    });

    if (!result) throw new NotFoundException();

    return;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, CanUserWorkWithComment)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param() commentId: string) {
    const result = await this.commentsService.deleteComment(commentId);

    if (!result) throw new NotFoundException();

    return;
  }
}
