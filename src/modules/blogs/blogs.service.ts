import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ImgData } from '../../types/img.data.interface';
import { ImgFileType } from '../files/types/img.file.type';

@Injectable()
export class BlogsService {
  async getBlogWallpaper(blogId: string): Promise<ImgData> {
    try {
      const dirPath = this._getDirPath(blogId, ImgFileType.BlogWallpaper);

      const imageName = await fs.readdir(dirPath);

      const pathToImg = path.resolve(dirPath, imageName[0]);

      const buffer = await fs.readFile(pathToImg);

      const { width, height, size } = await sharp(buffer).metadata();

      return {
        url: ImgFileType.BlogWallpaper + `/${blogId}` + '/' + imageName[0],
        width,
        height,
        fileSize: size,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlogMainImages(blogId: string): Promise<ImgData[]> {
    try {
      const dirPath = this._getDirPath(blogId, ImgFileType.BlogMain);

      const imagesNames = await fs.readdir(dirPath);

      return Promise.all(
        imagesNames.map(async n => {
          const pathToImg = path.resolve(dirPath, n);

          const buffer = await fs.readFile(pathToImg);

          const { width, height, size } = await sharp(buffer).metadata();

          return {
            url: ImgFileType.BlogMain + `/${blogId}` + '/' + n,
            width,
            height,
            fileSize: size,
          };
        }),
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private _getDirPath(blogId: string, type: ImgFileType) {
    return path.resolve(__dirname, '../..', 'static', type, blogId);
  }
}
