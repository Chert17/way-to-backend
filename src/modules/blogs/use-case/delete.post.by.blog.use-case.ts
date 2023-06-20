import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepo } from '../../posts/repositories/post.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class DeletePostByBlogCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostByBlogCommand)
export class DeletePostByBlogUseCase
  implements ICommandHandler<DeletePostByBlogCommand>
{
  constructor(private postsRepo: PostsRepo, private blogsRepo: BlogsRepo) {}

  async execute({ userId, blogId, postId }: DeletePostByBlogCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException();

    return this.postsRepo.deletePost(postId);
  }
}
