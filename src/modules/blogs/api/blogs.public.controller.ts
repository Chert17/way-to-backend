import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { UserId } from '../../../infra/decorators/params/req.userId.decorator';
import { UserIdFromToken } from '../../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../../types/req.user.interface';
import {
  BlogQueryPagination,
  PostQueryPagination,
} from '../../../utils/pagination/pagination';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { GetAllBlogsCommand } from '../use-case/get.all.blogs.use-case';
import { GetAllPostsByBlogCommand } from '../use-case/get.all.posts.by.blog.use-case';
import { GetBlogByIdCommand } from '../use-case/get.blog.by.id.use-case';

@Controller('blogs')
export class BlogsPublicController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getAllBlogs(@Query() pagination: BlogQueryPagination) {
    return this.commandBus.execute(new GetAllBlogsCommand(pagination));
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    return this.commandBus.execute(new GetBlogByIdCommand(blogId));
  }

  @Get('/:blogId/posts')
  @UseGuards(UserIdFromToken)
  getPostsByBlog(
    @Param('blogId') blogId: string,
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(
      new GetAllPostsByBlogCommand(userId, blogId, pagination),
    );
  }
}
