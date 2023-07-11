import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class BlogSubscriptionCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(BlogSubscriptionCommand)
export class BlogSubscriptionUseCase
  implements ICommandHandler<BlogSubscriptionCommand>
{
  constructor(private blogsRepo: BlogsRepo, private usersRepo: UsersRepo) {}

  async execute({ userId, blogId }: BlogSubscriptionCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    const user = await this.usersRepo.checkUserById(userId);

    if (!user.telegram_id) return;

    return this.blogsRepo.blogSubscription(userId, blogId);
  }
}
