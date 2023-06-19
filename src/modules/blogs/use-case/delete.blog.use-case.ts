import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../repositories/blogs.repo';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ blogId }: DeleteBlogCommand) {
    return this.blogsRepo.deleteBlog(blogId);
  }
}
