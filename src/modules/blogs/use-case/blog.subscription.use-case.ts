import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';
import { BlogsRepo } from '../repositories/blogs.repo';
import { BlogSub } from '../types/blog.types';

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

    const isSub = await this.blogsRepo.checkBlogSubByUser(
      userId,
      blogId,
      BlogSub.Subscribed,
    );

    if (isSub) return;

    return this.blogsRepo.blogSubscription(userId, blogId);
  }
}
