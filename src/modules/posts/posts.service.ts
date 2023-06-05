import { Injectable } from '@nestjs/common';

import { DbType } from '../../types/db.interface';
import { MongoId } from '../../types/mongo._id.interface';
import { Comment } from '../comments/comments.schema';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentServiceDto } from '../comments/dto/input/create.comment.dto';
import { PostsLikeStatusDbDto } from './dto/db/like.status.db.dto';
import { createPostServiceDto } from './dto/input/create.post.dto';
import { updatePostDto } from './dto/input/update.post.dto';
import { PostsRepo } from './repositories/posts.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsService: CommentsService,
  ) {}

  async createPost(dto: createPostServiceDto): Promise<MongoId> {
    return await this.postsRepo.createPost(dto);
  }

  async createCommentByPost(
    dto: CreateCommentServiceDto,
  ): Promise<false | DbType<Comment>> {
    const post = await this.postsRepo.checkPostById(dto.postId);

    if (!post) return false; // not found post by post id

    return await this.commentsService.createComment(dto);
  }

  async updatePost(dto: updatePostDto, postId: string): Promise<boolean> {
    const post = await this.postsRepo.checkPostById(postId);

    if (!post) return false; // not found post by id

    return await this.postsRepo.updatePost(dto, postId);
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
