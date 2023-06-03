import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '../../infra/decorators/param/req.userId.decorator';
import { BasicAuthGuard } from '../../infra/guards/auth/basic.auth.guard';
import { UserIdFromToken } from '../../infra/guards/auth/userId.from.token.guard';
import { ReqUserIdType } from '../../types/req.user.interface';
import {
  BlogQueryPagination,
  PostQueryPagination,
} from '../../utils/pagination/pagination';
import { PostsQueryRepo } from '../posts/repositories/posts.query.repo';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/input/create.blog.dto';
import { CreatePostByBlogDto } from './dto/input/create.post.by.blog.dto';
import { UpdateBlogDto } from './dto/input/update.blog.dto';
import { BlogsQueryRepo } from './repositories/blogs.query.repo';

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

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto: CreateBlogDto) {
    const result = await this.blogsService.createBlog(dto);

    return await this.blogsQueryRepo.getBlogById(result._id.toString());
  }

  @Post('/:blogId/posts')
  @UseGuards(BasicAuthGuard, UserIdFromToken)
  async createPostByBlog(
    @Param('blogId') blogId: string,
    @Body() dto: CreatePostByBlogDto,
    @UserId() userId: ReqUserIdType,
  ) {
    const result = await this.blogsService.createPostByBlog({ ...dto, blogId });

    if (!result) throw new NotFoundException(); // If specified blog doesn't exists

    return await this.postsQueryRepo.getPostById(result._id.toString(), userId);
  }

  @Put('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(@Param() blogId: string, @Body() dto: UpdateBlogDto) {
    const result = await this.blogsService.updateBlog(dto, blogId);

    if (!result) throw new NotFoundException();

    return;
  }

  @Delete('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlog(@Param() blogId: string) {
    const result = await this.blogsService.deleteBlog(blogId);

    if (!result) throw new NotFoundException();

    return;
  }
}
