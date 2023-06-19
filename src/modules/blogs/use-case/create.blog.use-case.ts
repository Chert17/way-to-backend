import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBlogServiceDto } from '../dto/create.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogServiceDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ dto }: CreateBlogCommand) {
    const { blogId } = await this.blogsRepo.createBlog({
      ...dto,
      createdAt: new Date().toISOString(),
    });

    return this.blogsQueryRepo.getBlogById(blogId);
  }
}
