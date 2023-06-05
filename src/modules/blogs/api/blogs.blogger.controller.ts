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

import { ReqUser } from '../../../infra/decorators/param/req.user.decorator';
import { JwtAuthGuard } from '../../../infra/guards/auth/jwt.auth.guard';
import { CanUserWorkWithBlog } from '../../../infra/guards/blogs/can.user.work.with.blog.guard';
import { DbType } from '../../../types/db.interface';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { PostsQueryRepo } from '../../posts/repositories/posts.query.repo';
import { User } from '../../users/schemas/users.schema';
import { BlogsService } from '../blogs.service';
import { CreateBlogDto } from '../dto/input/create.blog.dto';
import { CreatePostByBlogDto } from '../dto/input/create.post.by.blog.dto';
import { UpdateBlogDto } from '../dto/input/update.blog.dto';
import { UpdatePostByBlogDto } from '../dto/input/update.post.by.blog';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('blogger/blogs')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(
    private blogsQueryRepo: BlogsQueryRepo,
    private blogsService: BlogsService,
    private postsQueryRepo: PostsQueryRepo,
  ) {}

  @Get()
  async getAllBlogsByBlogger(
    @ReqUser() user: DbType<User>,
    @Query() pagination: BlogQueryPagination,
  ) {
    return await this.blogsQueryRepo.getAllBlogsByUserId(user._id, pagination);
  }

  @Post()
  async createBlog(@ReqUser() user: DbType<User>, @Body() dto: CreateBlogDto) {
    const blogId = await this.blogsService.createBlog({
      userId: user._id.toString(),
      ...dto,
    });

    return await this.blogsQueryRepo.getBlogById(blogId.toString());
  }

  @Post('/:blogId/posts')
  @UseGuards(CanUserWorkWithBlog)
  async createPostByBlog(
    @ReqUser() user: DbType<User>,
    @Param('blogId') blogId: string,
    @Body() dto: CreatePostByBlogDto,
  ) {
    const result = await this.blogsService.createPostByBlog({ ...dto, blogId });

    return await this.postsQueryRepo.getPostById(
      result._id.toString(),
      user._id.toString(),
    );
  }

  @Put('/:id')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async updateBlog(@Param() blogId: string, @Body() dto: UpdateBlogDto) {
    return await this.blogsService.updateBlog({ ...dto, blogId });
  }

  @Put(':blogId/posts/:postId')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async updatePostByBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostByBlogDto,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException();

    return await this.blogsService.updatePostByBlog({ ...dto, blogId, postId });
  }

  @Delete('/:id')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async deleteBlog(@Param() blogId: string) {
    return await this.blogsService.deleteBlog(blogId);
  }

  @Delete(':blogId/posts/:postId')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async deletePostByBlog(@Param('postId') postId: string) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException();

    return await this.blogsService.deletePostByBlog(postId);
  }
}
