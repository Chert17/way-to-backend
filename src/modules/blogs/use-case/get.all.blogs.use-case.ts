import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsService } from '../blogs.service';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetAllBlogsCommand {
  constructor(public userId: string, public pagination: BlogQueryPagination) {}
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsUseCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ userId, pagination }: GetAllBlogsCommand) {
    const blogs = await this.blogsQueryRepo.getAllBlogs(userId, pagination);

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
