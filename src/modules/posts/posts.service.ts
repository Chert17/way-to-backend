import { Injectable } from '@nestjs/common';

import { MongoId } from '../../types/mongo._id.interface';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentServiceDto } from '../comments/dto/input/create.comment.dto';
import { PostsLikeStatusDbDto } from './dto/db/like.status.db.dto';
import { createPostServiceDto } from './dto/input/create.post.dto';
import { updatePostServiceDto } from './dto/input/update.post.dto';
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

  async createCommentByPost(dto: CreateCommentServiceDto): Promise<MongoId> {
    return await this.commentsService.createComment(dto);
  }

  async updatePost(dto: updatePostServiceDto): Promise<boolean> {
    return await this.postsRepo.updatePost(dto);
  }

  async updateLikeStatus(dto: PostsLikeStatusDbDto) {
    return await this.postsRepo.updatePostLikeStatus(dto);
  }

  async updateBanUserInfoForPostLike(userId: string, isBanned: boolean) {
    return await this.postsRepo.updateBanUserInfoForPostLike(userId, isBanned);
  }

  async deletePost(postId: string): Promise<boolean> {
    return await this.postsRepo.deletePost(postId);
  }
}
