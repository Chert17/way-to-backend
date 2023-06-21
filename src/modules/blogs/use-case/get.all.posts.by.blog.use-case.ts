import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class GetAllPostsByBlogCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public pagination: PostQueryPagination,
  ) {}
}

@CommandHandler(GetAllPostsByBlogCommand)
export class GetAllPostsByBlogUseCase
  implements ICommandHandler<GetAllPostsByBlogCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ userId, blogId, pagination }: GetAllPostsByBlogCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.is_ban) throw new NotFoundException();

    return this.blogsQueryRepo.getAllPostsByBlog(userId, blogId, pagination);
  }
}
