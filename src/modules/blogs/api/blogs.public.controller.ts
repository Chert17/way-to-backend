import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { UserId } from '../../../infra/decorators/params/req.userId.decorator';
import { UserIdFromToken } from '../../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../../types/req.user.interface';
import {
  BlogQueryPagination,
  PostQueryPagination,
} from '../../../utils/pagination/pagination';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { GetAllPostsByBlogCommand } from '../use-case/get.all.posts.by.blog.use-case';

@Controller('blogs')
export class BlogsPublicController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAll(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogs(pagination);
  }

  @Get()
  async getAll(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogs(pagination);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    const result = await this.blogsQueryRepo.getBlogById(blogId);

    if (!result) throw new NotFoundException();

    return result;
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
