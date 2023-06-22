import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../infra/decorators/params/req.user.decorator';
import { UserId } from '../../infra/decorators/params/req.userId.decorator';
import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../types/req.user.interface';
import { PostQueryPagination } from '../../utils/pagination/pagination';
import { User } from '../users/entities/user.entity';
import { createCommentDto } from './dto/create.comment.dto';
import { PostsQueryRepo } from './repositories/post.query.repo';
import { CreateCommentByPostCommand } from './use-case/create.comment.by.post.use-case';
import { GetPostsByIdCommand } from './use-case/get.post.by.id.use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepo: PostsQueryRepo,
    private commandBus: CommandBus,
  ) {}

  @Get()
  getAll(
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.postsQueryRepo.getAllPosts(userId, pagination);
  }

  @Get('/:postId')
  @UseGuards(UserIdFromToken)
  getPostById(
    @Param('postId') postId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(new GetPostsByIdCommand(userId, postId));
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
}
