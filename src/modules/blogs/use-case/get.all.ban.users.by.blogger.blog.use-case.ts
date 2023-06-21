import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { UsersRepo } from '../../users/repositories/users.repo';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class GetAllBanUsersByBloggerBlogCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public pagination: BlogQueryPagination,
  ) {}
}

@CommandHandler(GetAllBanUsersByBloggerBlogCommand)
export class GetAllBanUsersByBloggerBlogUseCase
  implements ICommandHandler<GetAllBanUsersByBloggerBlogCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private usersRepo: UsersRepo,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({
    userId,
    blogId,
    pagination,
  }: GetAllBanUsersByBloggerBlogCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    const result = await this.usersRepo.checkUserById(userId);

    if (!result) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    return this.blogsQueryRepo.getAllBanUsersByBloggerBlog(blogId, pagination);
  }
}
