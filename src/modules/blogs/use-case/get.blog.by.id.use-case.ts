import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsService } from '../blogs.service';
import { BlogViewWithImagesDto } from '../dto/blog.view.dto';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';

export class GetBlogByIdCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async execute({
    userId,
    blogId,
  }: GetBlogByIdCommand): Promise<BlogViewWithImagesDto> {
    const blog = await this.blogsQueryRepo.getBlogById(userId, blogId);

    if (!blog) throw new NotFoundException();

    const images = await this.blogsService.getBlogImages(blogId);

    return { ...blog, images };
  }
}
