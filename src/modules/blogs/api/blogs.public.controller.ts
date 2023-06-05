import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '../../../infra/decorators/param/req.userId.decorator';
import { UserIdFromToken } from '../../../infra/guards/auth/userId.from.token.guard';
import { ReqUserIdType } from '../../../types/req.user.interface';
import {
  BlogQueryPagination,
  PostQueryPagination,
} from '../../../utils/pagination/pagination';
import { PostsQueryRepo } from '../../posts/repositories/posts.query.repo';
import { BlogsService } from '../blogs.service';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepo: BlogsQueryRepo,
    private blogsService: BlogsService,
    private postsQueryRepo: PostsQueryRepo,
  ) {}

  @Get()
  async getAll(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogs(pagination);
  }

  @Get('/:id')
  async getBlogById(@Param() blogId: string) {
    const result = await this.blogsQueryRepo.getBlogById(blogId);

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get('/:blogId/posts')
  @UseGuards(UserIdFromToken)
  async getPostsByBlog(
    @Param('blogId') blogId: string,
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    const blog = await this.blogsQueryRepo.getBlogById(blogId);

    if (!blog) throw new NotFoundException(); // If specified blog doesn't exists

    return await this.postsQueryRepo.getAllPostsByBlogId(
      blogId,
      pagination,
      userId,
    );
  }
}
