import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostWithImagesViewDto } from '../dto/post.view.dto';
import { PostsService } from '../posts.service';
import { PostsQueryRepo } from '../repositories/post.query.repo';

export class GetPostByIdCommand {
  constructor(public userId: string, public postId: string) {}
}

@CommandHandler(GetPostByIdCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo,
  ) {}

  async execute({
    userId,
    postId,
  }: GetPostByIdCommand): Promise<PostWithImagesViewDto> {
    const post = await this.postsQueryRepo.getPostById(userId, postId);

    if (!post) throw new NotFoundException();

    const images = await this.postsService.getPostImages(postId);

    return { ...post, images };
  }
}
