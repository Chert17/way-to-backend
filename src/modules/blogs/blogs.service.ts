import { DbType } from 'src/types/db.interface';

import { Inject, Injectable } from '@nestjs/common';

import { createPostDto } from '../posts/dto/input/create.post.dto';
import { PostViewDto } from '../posts/dto/view/post.view.dto';
import { PostsQueryRepo } from '../posts/repositories/posts.query.repo';
import { PostsRepo } from '../posts/repositories/posts.repo';
import { Blog } from './blogs.schema';
import { CreateBlogDto } from './dto/input/create.blog.dto';
import { UpdateBlogDto } from './dto/input/update.blog.dto';
import { BlogsRepo } from './repositories/blogs.repo';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BlogsRepo) private blogsRepo: BlogsRepo,
    @Inject(PostsRepo) private postsRepo: PostsRepo,
    @Inject(PostsQueryRepo) private postsQueryRepo: PostsQueryRepo,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<DbType<Blog>> {
    return await this.blogsRepo.createBlog(dto);
  }

  async createPostByBlog(dto: createPostDto): Promise<false | PostViewDto> {
    const blog = await this.blogsRepo.checkBlogById(dto.blogId);

    if (!blog) return false; // not found blog by blog id

    const result = await this.postsRepo.createPost(dto);

    return await this.postsQueryRepo.getPostById(result._id.toString());
  }

  async updateBlog(dto: UpdateBlogDto): Promise<boolean> {
    const blog = await this.blogsRepo.checkBlogById(dto.blogId);

    if (!blog) return false; // not found blog by blog id

    return await this.blogsRepo.updateBlog(dto);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) return false; // not found blog by blog id

    return await this.blogsRepo.deleteBlog(blogId);
  }
}
