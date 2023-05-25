import { Model } from 'mongoose';

import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog } from '../blogs/blogs.schema';
import { Post } from '../posts/posts.schema';

@Controller('/testing/all-data')
export class DeleteAllController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  @Delete()
  @HttpCode(204)
  async delteAll() {
    await this.blogModel.deleteMany();
    await this.postModel.deleteMany();
  }
}
