import { Model } from 'mongoose';

import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog } from '../blogs/blogs.schema';
import { Comment } from '../comments/comments.schema';
import { Post } from '../posts/posts.schema';
import { User } from '../users/schemas/users.schema';

@Controller('/testing/all-data')
export class DeleteAllController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  @Delete()
  @HttpCode(204)
  async delteAll() {
    await this.blogModel.deleteMany();
    await this.postModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.userModel.deleteMany();
  }
}
