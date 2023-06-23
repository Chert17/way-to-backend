import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../../blogs/repositories/blogs.repo';
import { CommentsQueryRepo } from '../../comments/repositories/comment.query.repo';
import { CommentsRepo } from '../../comments/repositories/comment.repo';
import { CreateCommentServiceDto } from '../dto/create.comment.dto';
import { PostsRepo } from '../repositories/post.repo';

export class CreateCommentByPostCommand {
  constructor(public dto: CreateCommentServiceDto) {}
}

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostUseCase
  implements ICommandHandler<CreateCommentByPostCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private commentsQueryRepo: CommentsQueryRepo,
  ) {}

  async execute({ dto }: CreateCommentByPostCommand) {
    const { userId, postId, content } = dto;

    const { is_banned } = await this.blogsRepo.checkBanUserByBlog(
      userId,
      postId,
    );

    if (is_banned) throw new ForbiddenException();

    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException();

    const { commentId } = await this.commentsRepo.createComment({
      userId,
      postId,
      content,
      createdAt: new Date().toISOString(),
    });

    return this.commentsQueryRepo.getCommentById(commentId, userId);
  }
}
