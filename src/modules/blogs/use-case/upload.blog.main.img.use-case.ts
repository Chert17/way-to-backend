import fs from 'fs';
import { readdir, writeFile } from 'fs/promises';
import path from 'path';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FileType } from '../../../types/file.interface';
import { BlogsService } from '../blogs.service';
import { BlogsQueryRepo } from '../repositories/blogs.query.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

export class UploadBlogMainImgCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public file: FileType,
  ) {}
}

@CommandHandler(UploadBlogMainImgCommand)
export class UploadBlogMainImgUseCase
  implements ICommandHandler<UploadBlogMainImgCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
    private blogsService: BlogsService,
  ) {}

  async execute({ userId, blogId, file }: UploadBlogMainImgCommand) {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    const rootDirPath = path.dirname(require.main.filename);
    const dirPath = path.join(
      rootDirPath,
      'assets',
      'blogs',
      'main',
      `${blogId}`,
      `${userId}`,
    );

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const imgPath = path.join(dirPath, file.originalname);

    await writeFile(imgPath, file.buffer);

    const imagesNames = await readdir(dirPath);

    const mainImages = await this.blogsService.getBlogMainImages(
      imagesNames,
      dirPath,
    );

    const wallpaper = await this.blogsQueryRepo.getBlogWallpaper(blogId);

    return {
      images: {
        wallpaper,
        main: mainImages,
      },
    };
  }
}
