import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../../infra/decorators/params/req.user.decorator';
import { JwtAuthGuard } from '../../../infra/guards/jwt.auth.guard';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { User } from '../../users/entities/user.entity';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { CreateBlogCommand } from '../use-case/create.blog.use-case';

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
}
