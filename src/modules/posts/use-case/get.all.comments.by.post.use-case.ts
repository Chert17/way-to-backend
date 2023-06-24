import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentQueryPagination } from '../../../utils/pagination/pagination';
import { CommentsQueryRepo } from '../../comments/repositories/comment.query.repo';
import { PostsRepo } from '../repositories/post.repo';

export class GetAllCommentsByPostCommand {
  constructor(
    public userId: string,
    public postId: string,
    public pagination: CommentQueryPagination,
  ) {}
}

@CommandHandler(GetAllCommentsByPostCommand)
export class GetAllCommentsByPostUseCase
  implements ICommandHandler<GetAllCommentsByPostCommand>
{
  constructor(
    private postsRepo: PostsRepo,
    private commentsQueryRepo: CommentsQueryRepo,
  ) {}

  async execute({ userId, postId, pagination }: GetAllCommentsByPostCommand) {
    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return await this.commentsQueryRepo.getAllCommentsByPost(
      userId,
      postId,
      pagination,
    );
  }
}
