import { ForbiddenException, NotFoundException } from '@nestjs/common';
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
    const { userId, blogId, description, name, websiteUrl } = dto;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    return this.blogsRepo.updateBlog({ blogId, description, name, websiteUrl });
  }
}
