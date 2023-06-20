import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../repositories/blogs.repo';

export class DeleteBlogCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ userId, blogId }: DeleteBlogCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    return this.blogsRepo.deleteBlog(blogId);
  }
}
