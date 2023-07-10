import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../repositories/blogs.repo';

export class BlogUnsubscriptionCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(BlogUnsubscriptionCommand)
export class BlogUnsubscriptionUseCase
  implements ICommandHandler<BlogUnsubscriptionCommand>
{
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ userId, blogId }: BlogUnsubscriptionCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    return this.blogsRepo.blogUnsubscription(userId, blogId);
  }
}
