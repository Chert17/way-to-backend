import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';
import { BanUserByBloggerBlogServiceDto } from '../dto/ban.user.by.blogger.blog.dto';
import { BlogsRepo } from '../repositories/blogs.repo';

export class BanUserByBloggerBlogCommand {
  constructor(public dto: BanUserByBloggerBlogServiceDto) {}
}

@CommandHandler(BanUserByBloggerBlogCommand)
export class BanUserByBloggerBlogUseCase
  implements ICommandHandler<BanUserByBloggerBlogCommand>
{
  constructor(private blogsRepo: BlogsRepo, private usersRepo: UsersRepo) {}

  async execute({ dto }: BanUserByBloggerBlogCommand) {
    const { userId, banUserId, blogId, isBanned, banReason } = dto;

    const user = await this.usersRepo.checkUserById(banUserId);

    if (!user) throw new NotFoundException();

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (blog.user_id !== userId) throw new ForbiddenException();

    return this.blogsRepo.banUserByBloggerBlog({
      banUserId,
      blogId,
      isBanned,
      banReason,
      banDate: new Date().toISOString(),
    });
  }
}
