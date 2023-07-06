import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsService } from '../blogs.service';
import { BlogViewWithImagesDto } from '../dto/blog.view.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({
    blogId,
  }: GetBlogByIdCommand): Promise<BlogViewWithImagesDto> {
    const blog = await this.blogsQueryRepo.getBlogById(blogId);

    if (!blog) throw new NotFoundException();

    const blogMainImg = await this._getViewBlogMainImg(blogId);

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
      images: { wallpaper: blog.wallpaper, main: blogMainImg },
    };
  }

  private async _getViewBlogMainImg(blogId: string) {
    const result = await this.blogsService.getBlogMainImages(blogId);

    if (!result) return [];

    return result;
  }
}
