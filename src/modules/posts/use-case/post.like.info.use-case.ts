import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsLikeStatusServiceDto } from '../dto/post.like.info.dto';
import { PostsRepo } from '../repositories/post.repo';

export class SetLikeInfoByPostCommand {
  constructor(public dto: PostsLikeStatusServiceDto) {}
}

@CommandHandler(SetLikeInfoByPostCommand)
export class SetLikeInfoByPostUseCase
  implements ICommandHandler<SetLikeInfoByPostCommand>
{
  constructor(private postsRepo: PostsRepo) {}

  async execute({ dto }: SetLikeInfoByPostCommand) {
    const { userId, postId, likeStatus } = dto;

    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return this.postsRepo.setLikeStatus({
      userId,
      postId,
      likeStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
