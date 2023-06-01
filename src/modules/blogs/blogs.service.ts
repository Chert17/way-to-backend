import { Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { createPostDto } from '../posts/dto/input/create.post.dto';
import { Post } from '../posts/posts.schema';
import { PostsRepo } from '../posts/repositories/posts.repo';
import { Blog } from './blogs.schema';
import { CreateBlogDto } from './dto/input/create.blog.dto';
import { UpdateBlogDto } from './dto/input/update.blog.dto';
import { BlogsRepo } from './repositories/blogs.repo';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepo, private postsRepo: PostsRepo) {}

  async createBlog(dto: CreateBlogDto): Promise<DbType<Blog>> {
    return await this.blogsRepo.createBlog(dto);
  }

  async createPostByBlog(dto: createPostDto): Promise<false | DbType<Post>> {
    const blogName = await this.blogsRepo.getAndCheckBlogName(dto.blogId);

    if (!blogName) return false; // not found blog by blog id

    return await this.postsRepo.createPost({ ...dto, blogName });
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
