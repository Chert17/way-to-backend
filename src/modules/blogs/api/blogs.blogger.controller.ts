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
import { UserId } from '../../../infra/decorators/param/req.userId.decorator';
import { JwtAuthGuard } from '../../../infra/guards/auth/jwt.auth.guard';
import { UserIdFromToken } from '../../../infra/guards/auth/userId.from.token.guard';
import { CanUserWorkWithBlog } from '../../../infra/guards/blogs/can.user.work.with.blog.guard';
import { DbType } from '../../../types/db.interface';
import { ReqUserIdType } from '../../../types/req.user.interface';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { PostsQueryRepo } from '../../posts/repositories/posts.query.repo';
import { User } from '../../users/schemas/users.schema';
import { BlogsService } from '../blogs.service';
import { CreateBlogDto } from '../dto/input/create.blog.dto';
import { CreatePostByBlogDto } from '../dto/input/create.post.by.blog.dto';
import { UpdateBlogDto } from '../dto/input/update.blog.dto';
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
  @UseGuards(UserIdFromToken)
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
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async updateBlog(@Param() blogId: string, @Body() dto: UpdateBlogDto) {
    return await this.blogsService.updateBlog({ ...dto, blogId });
  }

  @Put()
  async updatePostByBlog() {}

  @Delete('/:id')
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(204)
  async deleteBlog(@Param() blogId: string) {
    return await this.blogsService.deleteBlog(blogId);
  }

  @Delete()
  async deletePostByBlog() {}
}
