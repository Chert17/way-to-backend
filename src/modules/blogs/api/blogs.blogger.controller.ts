import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../../infra/decorators/params/req.user.decorator';
import { CanUserWorkWithBlog } from '../../../infra/guards/can.user.work.with.blog.guard';
import { JwtAuthGuard } from '../../../infra/guards/jwt.auth.guard';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { User } from '../../users/entities/user.entity';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { CreateBlogCommand } from '../use-case/create.blog.use-case';
import { UpdateBlogCommand } from '../use-case/update.blog.use-case';

@Controller('blogger')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(
    private readonly commandBus: CommandBus,
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
  @UseGuards(CanUserWorkWithBlog)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @ReqUser() user: User,
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.commandBus.execute(new UpdateBlogCommand({ ...dto, blogId }));
  }
}
