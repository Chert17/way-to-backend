import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../infra/decorators/params/req.user.decorator';
import { UserId } from '../../infra/decorators/params/req.userId.decorator';
import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/userId.from.token.guard';
import { LikeStatusDto } from '../../types/like.info.interface';
import { ReqUserIdType } from '../../types/req.user.interface';
import {
  CommentQueryPagination,
  PostQueryPagination,
} from '../../utils/pagination/pagination';
import { User } from '../users/entities/user.entity';
import { createCommentDto } from './dto/create.comment.dto';
import { PostsQueryRepo } from './repositories/post.query.repo';
import { CreateCommentByPostCommand } from './use-case/create.comment.by.post.use-case';
import { GetAllCommentsByPostCommand } from './use-case/get.all.comments.by.post.use-case';
import { GetAllPostsCommand } from './use-case/get.all.posts.use-case';
import { GetPostByIdCommand } from './use-case/get.post.by.id.use-case';
import { SetLikeInfoByPostCommand } from './use-case/post.like.info.use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepo: PostsQueryRepo,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(UserIdFromToken)
  getAll(
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(new GetAllPostsCommand(userId, pagination));
  }

  @Get('/:postId')
  @UseGuards(UserIdFromToken)
  getPostById(
    @Param('postId') postId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(new GetPostByIdCommand(userId, postId));
  }

  @Get('/:postId/comments')
  @UseGuards(UserIdFromToken)
  getCommnetsByPost(
    @Param('postId') postId: string,
    @Query() pagination: CommentQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(
      new GetAllCommentsByPostCommand(userId, postId, pagination),
    );
  }

  @Post('/:postId/comments')
  @UseGuards(JwtAuthGuard)
  createCommentByPost(
    @Param('postId') postId: string,
    @Body() dto: createCommentDto,
    @ReqUser() user: User,
  ) {
    return this.commandBus.execute(
      new CreateCommentByPostCommand({
        userId: user.id,
        postId,
        content: dto.content,
      }),
    );
  }

  @Put('/:postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  setPostLike(
    @Param('postId') postId: string,
    @Body() dto: LikeStatusDto,
    @ReqUser() user: User,
  ) {
    return this.commandBus.execute(
      new SetLikeInfoByPostCommand({
        userId: user.id,
        postId,
        likeStatus: dto.likeStatus,
      }),
    );
  }
}
