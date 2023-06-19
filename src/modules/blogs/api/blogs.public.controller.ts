import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

@Controller('blogs')
export class BlogsPublicController {
  constructor(private readonly blogsQueryRepo: BlogsQueryRepo) {}

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    const result = await this.blogsQueryRepo.getBlogById(blogId);

    if (!result) throw new NotFoundException();

    return result;
  }
}
