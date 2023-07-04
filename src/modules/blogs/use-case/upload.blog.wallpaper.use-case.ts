import sharp from 'sharp';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FileType } from '../../../types/file.interface';
import { SETTINGS } from '../../../utils/settings';
import { BlogsRepo } from '../repositories/blogs.repo';

const { SERVEO_URL, PORT } = SETTINGS;

export class UploadBlogWallpaperCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public file: FileType,
  ) {}
}

@CommandHandler(UploadBlogWallpaperCommand)
export class UploadBlogWallpaperUseCase
  implements ICommandHandler<UploadBlogWallpaperCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private configService: ConfigService,
  ) {}

  async execute({ userId, blogId, file }: UploadBlogWallpaperCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    const { width, height, size } = await sharp(file.buffer).metadata();

    const imgUrl = `/${userId}/${blogId}/${file.originalname}`;

    await this.blogsRepo.uploadBlogWallpaper(blogId, {
      url: imgUrl,
      width,
      height,
      fileSize: size,
    });

    return {
      wallpaper: {
        url:
          this.configService.get(SERVEO_URL) ??
          this.configService.get(PORT) + `/${imgUrl}`,
        width,
        height,
        fileSize: size,
      },
      main: [],
    };
  }
}
