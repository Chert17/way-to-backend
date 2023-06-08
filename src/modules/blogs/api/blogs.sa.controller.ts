import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../../../infra/guards/auth/basic.auth.guard';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsService } from '../blogs.service';
import { BanBlogDto } from '../dto/input/ban.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('sa')
@UseGuards(BasicAuthGuard)
export class BlogsSAController {
  constructor(
    private blogsQueryRepo: BlogsQueryRepo,
    private blogsService: BlogsService,
  ) {}

  @Get('/blogs')
  async getAllBlogs(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogsBySA(pagination);
  }

  @Put('/blogs/:blogId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banBlog(@Param('blogId') blogId: string, @Body() dto: BanBlogDto) {
    const result = await this.blogsService.banBlog({ ...dto, blogId });

    if (!result) throw new NotFoundException();

    return;
  }
}
