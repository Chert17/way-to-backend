import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('blogs')
export class BlogsPublicController {
  constructor(private readonly blogsQueryRepo: BlogsQueryRepo) {}

  @Get()
  async getAll(@Query() pagination: BlogQueryPagination) {
    return await this.blogsQueryRepo.getAllBlogs(pagination);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    const result = await this.blogsQueryRepo.getBlogById(blogId);

    if (!result) throw new NotFoundException();

    return result;
  }
}
