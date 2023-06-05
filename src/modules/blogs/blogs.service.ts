import { Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { MongoId } from '../../types/mongo._id.interface';
import { createPostDto } from '../posts/dto/input/create.post.dto';
import { Post } from '../posts/posts.schema';
import { PostsService } from '../posts/posts.service';
import { CreateBlogServiceDto } from './dto/input/create.blog.dto';
import { UpdateBlogDto } from './dto/input/update.blog.dto';
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

  async updateBlog(dto: UpdateBlogDto, blogId: string): Promise<boolean> {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) return false; // not found blog by blog id

    return await this.blogsRepo.updateBlog(dto, blogId);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) return false; // not found blog by blog id

    return await this.blogsRepo.deleteBlog(blogId);
  }
}
