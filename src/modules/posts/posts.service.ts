import { Inject, Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { Comment } from '../comments/comments.schema';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/input/create.comment.dto';
import { createPostDto } from './dto/input/create.post.dto';
import { updatePostDto } from './dto/input/update.post.dto';
import { Post } from './posts.schema';
import { PostsRepo } from './repositories/posts.repo';

@Injectable()
export class PostsService {
  constructor(
    @Inject(PostsRepo) private postsRepo: PostsRepo,
    @Inject(BlogsRepo) private blogsRepo: BlogsRepo,
    @Inject(CommentsService) private commentsService: CommentsService,
  ) {}

  async createPost(dto: createPostDto): Promise<false | DbType<Post>> {
    const blogId = await this.blogsRepo.checkBlogById(dto.blogId);

    if (!blogId) return false;

    return await this.postsRepo.createPost(dto);
  }

  async createCommentByPost(
    dto: CreateCommentDto,
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

  async deletePost(postId: string): Promise<boolean> {
    const post = await this.postsRepo.checkPostById(postId);

    if (!post) return false; // not found post by post id

    return await this.postsRepo.deletePost(postId);
  }
}
