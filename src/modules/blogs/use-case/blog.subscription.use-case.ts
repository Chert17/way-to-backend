import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../repositories/blogs.repo';

export class BlogSubscriptionCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(BlogSubscriptionCommand)
export class BlogSubscriptionUseCase
  implements ICommandHandler<BlogSubscriptionCommand>
{
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ userId, blogId }: BlogSubscriptionCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    return this.blogsRepo.blogSubscription(userId, blogId);
  }
}
