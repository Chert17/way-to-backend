import { Controller, Get, Put } from '@nestjs/common';

@Controller('blogs')
export class BlogsSAController {
  constructor() {}

  @Get()
  async getAllBlogs() {}

  @Put()
  async bindBlogToUserId() {}
}
