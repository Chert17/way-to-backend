import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MulterFileType } from '../../../types/file.interface';
import { FilesService } from '../../files/files.service';
import { ImgFileType } from '../../files/types/img.file.type';
import { BlogsService } from '../blogs.service';
import { BlogsRepo } from '../repositories/blogs.repo';

export class UploadBlogMainImgCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public file: MulterFileType,
  ) {}
}

@CommandHandler(UploadBlogMainImgCommand)
export class UploadBlogMainImgUseCase
  implements ICommandHandler<UploadBlogMainImgCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsService: BlogsService,
    private filesService: FilesService,
  ) {}

  async execute({ userId, blogId, file }: UploadBlogMainImgCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    this.filesService.uploadFile(file, ImgFileType.BlogMain + `/${blogId}`);

    const mainImages = await this.blogsService.getBlogMainImages(blogId);

    const blogWallpaper = await this.blogsService.getBlogWallpaper(blogId);

    return {
      images: {
        wallpaper: blogWallpaper,
        main: mainImages,
      },
    };
  }
}
