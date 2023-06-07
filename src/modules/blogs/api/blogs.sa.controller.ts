import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { BasicAuthGuard } from '../../../infra/guards/auth/basic.auth.guard';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('sa')
@UseGuards(BasicAuthGuard)
export class BlogsSAController {
  constructor(private blogsQueryRepo: BlogsQueryRepo) {}

  @Get('/blogs')
  async getAllBlogs(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogsBySA(pagination);
  }
}
