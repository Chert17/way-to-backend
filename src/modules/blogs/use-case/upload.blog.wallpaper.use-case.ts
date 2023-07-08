import sharp from 'sharp';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FilesService } from '../../files/files.service';
import { ImgFileType } from '../../files/types/img.file.type';
import { BlogsService } from '../blogs.service';
import { UploadBlogWallpaperDto } from '../dto/blog.img.dto';
import { BlogsRepo } from '../repositories/blogs.repo';

export class UploadBlogWallpaperCommand {
  constructor(public dto: UploadBlogWallpaperDto) {}
}

@CommandHandler(UploadBlogWallpaperCommand)
export class UploadBlogWallpaperUseCase
  implements ICommandHandler<UploadBlogWallpaperCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private filesService: FilesService,
    private blogsService: BlogsService,
  ) {}

  async execute({ dto }: UploadBlogWallpaperCommand) {
    const { blogId, userId, file } = dto;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    const wallpaperUrl = this.filesService.uploadFile(
      file,
      ImgFileType.BlogWallpaper + `/${blogId}`,
    );

    const { width, height, size } = await sharp(file.buffer).metadata();

    const mainImages = await this.blogsService.getBlogMainImages(blogId);

    return {
      wallpaper: {
        url: wallpaperUrl,
        width,
        height,
        fileSize: size,
      },
      main: mainImages,
    };
  }
}
