import { Injectable } from '@nestjs/common';

import { MongoId } from '../../types/mongo._id.interface';
import { PostsService } from '../posts/posts.service';
import { BanBlogServiceDto } from './dto/input/ban.blog.dto';
import { BanUserByBloggerBlogServiceDto } from './dto/input/ban.user.by.blogger.blog.dto';
import { CreateBlogServiceDto } from './dto/input/create.blog.dto';
import { CreatePostByBlogServiceDto } from './dto/input/create.post.by.blog.dto';
import { UpdateBlogServiceDto } from './dto/input/update.blog.dto';
import { UpdatePostByBlogServiceDto } from './dto/input/update.post.by.blog';
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

  async updatePostByBlog(dto: UpdatePostByBlogServiceDto) {
    return await this.postsService.updatePost(dto);
  }

  async banUserByBloggerBlog(dto: BanUserByBloggerBlogServiceDto) {
    const isBan = dto.isBanned;

    const banDate = isBan ? new Date() : null;
    const banReason = isBan ? dto.banReason : null;

    return await this.blogsRepo.updateBanUserByBloggerBlogStatus({
      ...dto,
      banDate,
      banReason,
    });
  }

  async banBlog(dto: BanBlogServiceDto) {
    return await this.blogsRepo.updateBanBlogStatus(dto);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsRepo.deleteBlog(blogId);
  }

  async deletePostByBlog(postId: string) {
    return await this.postsService.deletePost(postId);
  }
}
