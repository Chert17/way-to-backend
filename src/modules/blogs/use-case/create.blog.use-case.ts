import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsService } from '../blogs.service';
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
    private blogsService: BlogsService,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<BlogViewWithImagesDto> {
    const { blogId } = await this.blogsRepo.createBlog({
      ...dto,
      createdAt: new Date().toISOString(),
    });

    const blogWithWallpaper = await this.blogsQueryRepo.getBlogById(blogId);

    return {
      ...blogWithWallpaper,
      images: {
        wallpaper: blogWithWallpaper.images.wallpaper,
        main: [],
      },
    };
  }
}
