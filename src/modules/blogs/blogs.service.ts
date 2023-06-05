import { Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { MongoId } from '../../types/mongo._id.interface';
import { createPostDto } from '../posts/dto/input/create.post.dto';
import { Post } from '../posts/posts.schema';
import { PostsService } from '../posts/posts.service';
import { CreateBlogServiceDto } from './dto/input/create.blog.dto';
import { UpdateBlogServiceDto } from './dto/input/update.blog.dto';
import { BlogsRepo } from './repositories/blogs.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsService: PostsService,
  ) {}

  async createBlog(dto: CreateBlogServiceDto): Promise<MongoId> {
    return await this.blogsRepo.createBlog(dto);
  }

  async createPostByBlog(dto: createPostDto): Promise<false | DbType<Post>> {
    return await this.postsService.createPost(dto);
  }

  async updateBlog(dto: UpdateBlogServiceDto): Promise<boolean> {
    return await this.blogsRepo.updateBlog(dto);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsRepo.deleteBlog(blogId);
  }
}
