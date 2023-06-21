import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { UserId } from '../../infra/decorators/params/req.userId.decorator';
import { UserIdFromToken } from '../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../types/req.user.interface';
import { PostQueryPagination } from '../../utils/pagination/pagination';
import { PostsQueryRepo } from './repositories/post.query.repo';
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
}
