import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ImgData } from '../../../types/img.data.interface';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsService } from '../blogs.service';
import { BlogViewWithWallpaperDto } from '../dto/blog.view.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetAllBlogsByUserCommand {
  constructor(public userId: string, public pagination: BlogQueryPagination) {}
}

@CommandHandler(GetAllBlogsByUserCommand)
export class GetAllBlogsByUserUseCase
  implements ICommandHandler<GetAllBlogsByUserCommand>
{
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({ userId, pagination }: GetAllBlogsByUserCommand) {
    const blogs = await this.blogsQueryRepo.getAllBlogsByUserId(
      userId,
      pagination,
    );

    const blogMainImg = await this._getViewBlogMainImg(blogs.items);

    return {
      ...blogs,
      items: blogs.items.map(b => ({
        ...b,
        images: {
          wallpaper: b.wallpaper,
          main: blogMainImg,
        },
      })),
    };
  }

  private async _getViewBlogMainImg(items: BlogViewWithWallpaperDto[]) {
    let imgs: ImgData[] = [];

    items.forEach(async b => {
      const result = await this.blogsService.getBlogMainImages(b.id);

      if (result) imgs = result;
    });

    return imgs;
  }
}
