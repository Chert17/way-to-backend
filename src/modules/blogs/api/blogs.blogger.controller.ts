import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  BlogQueryPagination,
  DefaultPagination,
} from '../../../utils/pagination/pagination';
import { PostsQueryRepo } from '../../posts/repositories/posts.query.repo';
import { UsersRepo } from '../../users/repositories/users.repo';
import { User } from '../../users/schemas/users.schema';
import { BlogsService } from '../blogs.service';
import { BanUserByBloggerBlogDto } from '../dto/input/ban.user.by.blogger.blog.dto';
import { CreateBlogDto } from '../dto/input/create.blog.dto';
import { CreatePostByBlogDto } from '../dto/input/create.post.by.blog.dto';
import { UpdateBlogDto } from '../dto/input/update.blog.dto';
import { UpdatePostByBlogDto } from '../dto/input/update.post.by.blog';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

@Controller('blogger')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(
    private blogsQueryRepo: BlogsQueryRepo,
    private blogsService: BlogsService,
    private postsQueryRepo: PostsQueryRepo,
    private usersRepo: UsersRepo,
    private blogsRepo: BlogsRepo,
  ) {}

  @Get('/blogs')
  async getAllBlogsByBlogger(
    @ReqUser() user: DbType<User>,
    @Query() pagination: BlogQueryPagination,
  ) {
    return await this.blogsQueryRepo.getAllBlogsByUserId(user._id, pagination);
  }

  @Get('/users/blog/:blogId')
  async getAllBanUsersByBloggerBlog(
    @ReqUser() user: DbType<User>,
    @Query() pagination: BlogQueryPagination,
    @Param('blogId') blogId: string,
  ) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    const result = await this.usersRepo.checkAndGetUserById(
      user._id.toHexString(),
    );

    if (!result) throw new NotFoundException();

    if (blog.userId !== user._id.toHexString()) throw new ForbiddenException();

    return await this.blogsQueryRepo.getAllBanUsersByBloggerBlog(
      user._id.toString(),
      blogId,
      pagination,
    );
  }

  @Get('/blogs/comments')
  async getAllCommentsByBloggerBlog(
    @ReqUser() user: DbType<User>,
    pagination: DefaultPagination,
  ) {
    return await this.blogsQueryRepo.getAllCommentsByBloggerBlog(
      user._id,
      pagination,
    );
  }

  @Post('/blogs')
  async createBlog(@ReqUser() user: DbType<User>, @Body() dto: CreateBlogDto) {
    const blogId = await this.blogsService.createBlog({
      userId: user._id.toString(),
      ...dto,
    });

    return await this.blogsQueryRepo.getBlogById(blogId.toString());
  }

  @Post('/blogs/:blogId/posts')
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

  @Put('/blogs/:blogId')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return await this.blogsService.updateBlog({ ...dto, blogId });
  }

  @Put('/blogs/:blogId/posts/:postId')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostByBlogDto,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException();

    return await this.blogsService.updatePostByBlog({ ...dto, blogId, postId });
  }

  @Put('/users/:userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUserByBlog(
    @ReqUser() user: DbType<User>,
    @Param('userId') userId: string,
    @Body() dto: BanUserByBloggerBlogDto,
  ) {
    const result = await this.usersRepo.checkAndGetUserById(userId);

    if (!result) throw new NotFoundException();

    const blog = await this.blogsRepo.checkBlogById(dto.blogId);

    if (!blog) throw new BadRequestException();

    if (blog.userId !== user._id.toHexString()) throw new ForbiddenException();

    await this.blogsService.banUserByBloggerBlog({
      userId,
      ...dto,
    });

    return;
  }

  @Delete('/:id')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() blogId: string) {
    return await this.blogsService.deleteBlog(blogId);
  }

  @Delete('/blogs/:blogId/posts/:postId')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlog(@Param('postId') postId: string) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException();

    return await this.blogsService.deletePostByBlog(postId);
  }
}
