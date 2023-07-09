import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { PostsService } from '../posts.service';
import { PostsQueryRepo } from '../repositories/post.query.repo';

export class GetAllPostsCommand {
  constructor(public userId: string, public pagination: PostQueryPagination) {}
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo,
  ) {}

  async execute({ userId, pagination }: GetAllPostsCommand) {
    const posts = await this.postsQueryRepo.getAllPosts(userId, pagination);

    const items = await Promise.all(
      posts.items.map(async p => ({
        ...p,
        images: await this.postsService.getPostImages(p.id),
      })),
    );

    return { ...posts, items };
  }
}
