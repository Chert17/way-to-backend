import { Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { Comment } from '../comments/comments.schema';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentServiceDto } from '../comments/dto/input/create.comment.dto';
import { PostsLikeStatusDbDto } from './dto/db/like.status.db.dto';
import { createPostDto } from './dto/input/create.post.dto';
import { updatePostDto } from './dto/input/update.post.dto';
import { Post } from './posts.schema';
import { PostsRepo } from './repositories/posts.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepo: PostsRepo,
    private blogsRepo: BlogsRepo,
    private commentsService: CommentsService,
  ) {}

  async createPost(dto: createPostDto): Promise<false | DbType<Post>> {
    const blogName = await this.blogsRepo.getAndCheckBlogName(dto.blogId);

    if (!blogName) return false;

    return await this.postsRepo.createPost({ ...dto, blogName });
  }

  async createCommentByPost(
    dto: CreateCommentServiceDto,
  ): Promise<false | DbType<Comment>> {
    const post = await this.postsRepo.checkPostById(dto.postId);

    if (!post) return false; // not found post by post id

    return await this.commentsService.createComment(dto);
  }

  async updatePost(dto: updatePostDto): Promise<boolean> {
    const post = await this.postsRepo.checkPostById(dto.postId);

    if (!post) return false; // not found post by post id

    return await this.postsRepo.updatePost(dto);
  }

  async updateLikeStatus(dto: PostsLikeStatusDbDto) {
    return await this.postsRepo.updatePostLikeStatus(dto);
  }

  async deletePost(postId: string): Promise<boolean> {
    const post = await this.postsRepo.checkPostById(postId);

    if (!post) return false; // not found post by post id

    return await this.postsRepo.deletePost(postId);
  }
}
