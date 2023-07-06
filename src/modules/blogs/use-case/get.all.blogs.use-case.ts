import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WithPagination } from '../../../types/pagination.interface';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogsService } from '../blogs.service';
import { BlogViewWithImagesDto } from '../dto/blog.view.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetAllBlogsCommand {
  constructor(public pagination: BlogQueryPagination) {}
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsUseCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({
    pagination,
  }: GetAllBlogsCommand): Promise<WithPagination<BlogViewWithImagesDto>> {
    const blogs = await this.blogsQueryRepo.getAllBlogs(pagination);

    const viewBlogs = await Promise.all(
      blogs.items.map(async b => {
        const blogMainImg = await this._getViewBlogMainImg(b.id);

        return {
          id: b.id,
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: b.isMembership,
          images: { wallpaper: b.wallpaper, main: blogMainImg },
        };
      }),
    );

    return { ...blogs, items: viewBlogs };
  }

  private async _getViewBlogMainImg(blogId: string) {
    const result = await this.blogsService.getBlogMainImages(blogId);

    if (!result) return [];

    return result;
  }
}
