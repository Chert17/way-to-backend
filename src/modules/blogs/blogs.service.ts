import { Injectable } from '@nestjs/common';

import { MongoId } from '../../types/mongo._id.interface';
import { PostsService } from '../posts/posts.service';
import { CreateBlogServiceDto } from './dto/input/create.blog.dto';
import { CreatePostByBlogServiceDto } from './dto/input/create.post.by.blog.dto';
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

  async createPostByBlog(dto: CreatePostByBlogServiceDto): Promise<MongoId> {
    const blogName = await this.blogsRepo.getBlogName(dto.blogId);

    return await this.postsService.createPost({ ...dto, blogName });
  }

  async updateBlog(dto: UpdateBlogServiceDto): Promise<boolean> {
    return await this.blogsRepo.updateBlog(dto);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsRepo.deleteBlog(blogId);
  }
}
