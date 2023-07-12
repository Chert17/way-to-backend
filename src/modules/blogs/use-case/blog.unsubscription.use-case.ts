import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../repositories/blogs.repo';
import { BlogSub } from '../types/blog.types';

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

    const isUnsub = await this.blogsRepo.checkBlogSubByUser(
      userId,
      blogId,
      BlogSub.Unsubscribed,
    );

    if (isUnsub) return;

    return this.blogsRepo.blogUnsubscription(userId, blogId);
  }
}
