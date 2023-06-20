import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '../../infra/decorators/params/req.userId.decorator';
import { UserIdFromToken } from '../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../types/req.user.interface';
import { PostQueryPagination } from '../../utils/pagination/pagination';
import { PostsQueryRepo } from './repositories/post.query.repo';

@Controller('posts')
export class PostsController {
  constructor(private postsQueryRepo: PostsQueryRepo) {}

  @Get()
  getAll(
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.postsQueryRepo.getAllPosts(userId, pagination);
  }

  @Get('/:postId')
  @UseGuards(UserIdFromToken)
  async getPostById(
    @Param('postId') postId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    const result = await this.postsQueryRepo.getPostById(userId, postId);

    if (!result) throw new NotFoundException(); // If specified post doesn't exists

    return result;
  }
}
