import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsRepo } from '../../blogs/repositories/blogs.repo';
import { PostsQueryRepo } from '../repositories/post.query.repo';

export class GetPostsByIdCommand {
  constructor(public userId: string, public postId: string) {}
}

@CommandHandler(GetPostsByIdCommand)
export class GetPostsByIdUseCase
  implements ICommandHandler<GetPostsByIdCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private postsQueryRepo: PostsQueryRepo,
  ) {}

  async execute({ userId, postId }: GetPostsByIdCommand) {
    const blog = await this.blogsRepo.checkBlogByPostId(postId);

    if (!blog) throw new NotFoundException();

    if (blog.is_ban) throw new NotFoundException();

    const result = await this.postsQueryRepo.getPostById(userId, postId);

    if (!result) throw new NotFoundException(); // If specified post doesn't exists

    return result;
  }
}
