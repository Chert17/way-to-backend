import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsService } from '../blogs.service';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetAllBlogsByUserCommand {
  constructor(public userId: string, public pagination: BlogQueryPagination) {}
}

@CommandHandler(GetAllBlogsByUserCommand)
export class GetAllBlogsByUserUseCase
  implements ICommandHandler<GetAllBlogsByUserCommand>
{
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ userId, pagination }: GetAllBlogsByUserCommand) {
    const blogs = await this.blogsQueryRepo.getAllBlogsByUserId(
      userId,
      pagination,
    );

    const items = await Promise.all(
      blogs.items.map(async b => ({
        ...b,
        images: await this.blogsService.getBlogImages(b.id),
      })),
    );

    return {
      ...blogs,
      items,
    };
  }
}
