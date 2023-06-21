import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BanBlogServiceDto } from '../dto/ban.blog.dto';
import { BlogsRepo } from '../repositories/blogs.repo';

export class BanBlogBySaCommand {
  constructor(public dto: BanBlogServiceDto) {}
}

@CommandHandler(BanBlogBySaCommand)
export class BBanBlogBySaUseCase
  implements ICommandHandler<BanBlogBySaCommand>
{
  constructor(private blogsRepo: BlogsRepo) {}

  async execute({ dto }: BanBlogBySaCommand) {
    const { blogId, isBanned } = dto;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    const banDate = isBanned ? new Date().toISOString() : null;

    return this.blogsRepo.banBlogBySA({ blogId, isBanned, banDate });
  }
}
