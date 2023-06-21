import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../../infra/guards/basic.auth.guard';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BanBlogDto } from '../dto/ban.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BanBlogBySaCommand } from '../use-case/ban.blog.by.sa.use-case';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepo,
  ) {}

  @Get()
  async getAllBlogs(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogsBySA(pagination);
  }

  @Put('/:blogId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banBlog(@Param('blogId') blogId: string, @Body() dto: BanBlogDto) {
    return this.commandBus.execute(new BanBlogBySaCommand({ ...dto, blogId }));
  }
}
