import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { ReqUser } from '../../../infra/decorators/params/req.user.decorator';
import { JwtAuthGuard } from '../../../infra/guards/jwt.auth.guard';
import { FileSizeValidationPipe } from '../../../infra/pipe/file-size.pipe';
import { FileType } from '../../../types/file.interface';
import {
  BlogQueryPagination,
  CommentQueryPagination,
} from '../../../utils/pagination/pagination';
import { User } from '../../users/entities/user.entity';
import { BanUserByBloggerBlogDto } from '../dto/ban.user.by.blogger.blog.dto';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { CreatePostByBlogDto } from '../dto/create.post.by.blog.dto';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { UpdatePostByBlogDto } from '../dto/update.post.by.blog';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BanUserByBloggerBlogCommand } from '../use-case/ban.user.byblogger.blog.use-case';
import { CreateBlogCommand } from '../use-case/create.blog.use-case';
import { CreatePostByBlogCommand } from '../use-case/create.post.by.blog.use-case';
import { DeleteBlogCommand } from '../use-case/delete.blog.use-case';
import { DeletePostByBlogCommand } from '../use-case/delete.post.by.blog.use-case';
import { GetAllBanUsersByBloggerBlogCommand } from '../use-case/get.all.ban.users.by.blogger.blog.use-case';
import { UpdateBlogCommand } from '../use-case/update.blog.use-case';
import { UpdatePostByBlogCommand } from '../use-case/update.post.by.blog.use-case';
import { UploadBlogWallpaperCommand } from '../use-case/upload.blog.wallpaper.use-case';

@Controller('blogger')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  @Get('/blogs')
  getAllBlogsByBlogger(
    @ReqUser() user: User,
    @Query() pagination: BlogQueryPagination,
  ) {
    return this.blogsQueryRepo.getAllBlogsByUserId(user.id, pagination);
  }

  @Post('/blogs')
  createBlog(@ReqUser() user: User, @Body() dto: CreateBlogDto) {
    return this.commandBus.execute(
      new CreateBlogCommand({ ...dto, userId: user.id }),
    );
  }

  @Put('/blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateBlog(
    @ReqUser() user: User,
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.commandBus.execute(
      new UpdateBlogCommand({ ...dto, blogId, userId: user.id }),
    );
  }

  @Delete('/blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlog(@ReqUser() user: User, @Param('blogId') blogId: string) {
    return this.commandBus.execute(new DeleteBlogCommand(user.id, blogId));
  }

  @Post('/blogs/:blogId/posts')
  createPostByBlog(
    @ReqUser() user: User,
    @Param('blogId') blogId: string,
    @Body() dto: CreatePostByBlogDto,
  ) {
    return this.commandBus.execute(
      new CreatePostByBlogCommand({ ...dto, blogId, userId: user.id }),
    );
  }

  @Put('/blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePostByBlog(
    @ReqUser() user: User,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostByBlogDto,
  ) {
    return this.commandBus.execute(
      new UpdatePostByBlogCommand({ ...dto, blogId, postId, userId: user.id }),
    );
  }

  @Delete('/blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePostByBlog(
    @ReqUser() user: User,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    return this.commandBus.execute(
      new DeletePostByBlogCommand(user.id, blogId, postId),
    );
  }

  @Put('/users/:banUserId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banUserByBlog(
    @ReqUser() user: User,
    @Param('banUserId') banUserId: string,
    @Body() dto: BanUserByBloggerBlogDto,
  ) {
    return this.commandBus.execute(
      new BanUserByBloggerBlogCommand({ ...dto, userId: user.id, banUserId }),
    );
  }

  @Get('/users/blog/:blogId')
  getAllBanUsersByBloggerBlog(
    @ReqUser() user: User,
    @Query() pagination: BlogQueryPagination,
    @Param('blogId') blogId: string,
  ) {
    return this.commandBus.execute(
      new GetAllBanUsersByBloggerBlogCommand(user.id, blogId, pagination),
    );
  }

  @Get('/blogs/comments')
  getAllCommentsByBloggerBlog(
    @ReqUser() user: User,
    @Query() pagination: CommentQueryPagination,
  ) {
    return this.blogsQueryRepo.getAllCommentsByBloggerBlog(user.id, pagination);
  }

  @Post('/blogs/:blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  uploadWallpaperForBlog(
    @UploadedFile(FileSizeValidationPipe) file: FileType,
    @Param('blogId') blogId: string,
    @ReqUser() user: User,
  ) {
    return this.commandBus.execute(
      new UploadBlogWallpaperCommand(user.id, blogId, file),
    );
  }
}
