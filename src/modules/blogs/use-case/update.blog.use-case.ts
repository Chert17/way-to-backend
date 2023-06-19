import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBlogServiceDto } from '../dto/update.blog.dto';
import { BlogsRepo } from '../repositories/blogs.repo';

export class UpdateBlogCommand {
  constructor(public dto: UpdateBlogServiceDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ dto }: UpdateBlogCommand) {
    const { blogId, description, name, websiteUrl } = dto;

    return this.blogsRepo.updateBlog({ blogId, description, name, websiteUrl });
  }
}
