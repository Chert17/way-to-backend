import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { NEW_POST_TELEGRAM_NOTIFICATION_EVENT } from '../../../utils/events/events';
import { PostsQueryRepo } from '../../posts/repositories/post.query.repo';
import { PostsRepo } from '../../posts/repositories/post.repo';
import { CreatePostByBlogServiceDto } from '../dto/create.post.by.blog.dto';
import { BlogsRepo } from '../repositories/blogs.repo';

export class CreatePostByBlogCommand {
  constructor(public dto: CreatePostByBlogServiceDto) {}
}

@CommandHandler(CreatePostByBlogCommand)
export class CreatePostByBlogUseCase
  implements ICommandHandler<CreatePostByBlogCommand>
{
  constructor(
    private postsRepo: PostsRepo,
    private postsQueryRepo: PostsQueryRepo,
    private blogsRepo: BlogsRepo,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ dto }: CreatePostByBlogCommand) {
    const { userId, blogId, title, shortDescription, content } = dto;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    const { postId } = await this.postsRepo.createPost({
      blogId,
      title,
      shortDescription,
      content,
      createdAt: new Date().toISOString(),
    });

    const post = await this.postsQueryRepo.getPostById(userId, postId);

    this.eventEmitter.emit(
      NEW_POST_TELEGRAM_NOTIFICATION_EVENT,
      userId,
      blogId,
    );

    return { ...post, images: { main: [] } };
  }
}
