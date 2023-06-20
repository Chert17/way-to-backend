import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepo } from '../../posts/repositories/post.repo';
import { UpdatePostByBlogServiceDto } from '../dto/update.post.by.blog';
import { BlogsRepo } from '../repositories/blogs.repo';

export class UpdatePostByBlogCommand {
  constructor(public dto: UpdatePostByBlogServiceDto) {}
}

@CommandHandler(UpdatePostByBlogCommand)
export class UpdatePostByBlogUseCase
  implements ICommandHandler<UpdatePostByBlogCommand>
{
  constructor(private postsRepo: PostsRepo, private blogsRepo: BlogsRepo) {}

  async execute({ dto }: UpdatePostByBlogCommand) {
    const { userId, postId, blogId, title, shortDescription, content } = dto;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException();

    return this.postsRepo.updatePost({
      postId,
      title,
      shortDescription,
      content,
    });
  }
}
