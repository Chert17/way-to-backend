import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogViewWithImagesDto } from '../dto/blog.view.dto';
import { CreateBlogServiceDto } from '../dto/create.blog.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogServiceDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<BlogViewWithImagesDto> {
    const { blogId } = await this.blogsRepo.createBlog({
      ...dto,
      createdAt: new Date().toISOString(),
    });

    const blog = await this.blogsQueryRepo.getBlogById(dto.userId, blogId);

    return {
      ...blog,
      images: {
        wallpaper: null,
        main: [],
      },
    };
  }
}
