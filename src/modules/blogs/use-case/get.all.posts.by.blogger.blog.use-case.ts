import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WithPagination } from '../../../types/pagination.interface';
import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { PostWithImagesViewDto } from '../../posts/dto/post.view.dto';
import { PostsService } from '../../posts/posts.service';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class GetAllPostsByBloggerBlogCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public pagination: PostQueryPagination,
  ) {}
}

@CommandHandler(GetAllPostsByBloggerBlogCommand)
export class GetAllPostsByBloggerBlogUseCase
  implements ICommandHandler<GetAllPostsByBloggerBlogCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
    private postsService: PostsService,
  ) {}

  async execute({
    userId,
    blogId,
    pagination,
  }: GetAllPostsByBloggerBlogCommand): Promise<
    WithPagination<PostWithImagesViewDto>
  > {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.is_ban) throw new NotFoundException();

    if (userId !== blog.user_id) throw new ForbiddenException();

    const posts = await this.blogsQueryRepo.getAllPostsByBlog(
      userId,
      blogId,
      pagination,
    );

    const items = await Promise.all(
      posts.items.map(async p => ({
        ...p,
        images: await this.postsService.getPostImages(p.id),
      })),
    );

    return { ...posts, items };
  }
}
