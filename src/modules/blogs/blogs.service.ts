import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImgData } from '../../types/img.data.interface';
import { SETTINGS } from '../../utils/settings';
import { ImgFileType } from '../files/types/img.file.type';

const { SERVEO_URL } = SETTINGS;

@Injectable()
export class BlogsService {
  private _serveoUrl: string;
  constructor(private configService: ConfigService) {
    this._serveoUrl = this.configService.get(SERVEO_URL);
  }

  async getBlogWallpaper(blogId: string): Promise<ImgData | null> {
    try {
      const dirPath = this._getDirPath(blogId, ImgFileType.BlogWallpaper);

      const imageName = await fs.readdir(dirPath);

      const pathToImg = path.resolve(dirPath, imageName[0]);

      const buffer = await fs.readFile(pathToImg);

      const { width, height, size } = await sharp(buffer).metadata();

      return {
        url: `${this._serveoUrl}/${ImgFileType.BlogWallpaper}/${blogId}/${imageName[0]}`,
        width,
        height,
        fileSize: size,
      };
    } catch (e) {
      return null;
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
            url: `${this._serveoUrl}/${ImgFileType.BlogMain}/${blogId}/${n}`,
            width,
            height,
            fileSize: size,
          };
        }),
      );
    } catch (e) {
      return [];
    }
  }

  async getBlogImages(blogId: string) {
    const blogWallpaper = await this.getBlogWallpaper(blogId);
    const mainImages = await this.getBlogMainImages(blogId);

    const images = {
      wallpaper: blogWallpaper,
      main: mainImages,
    };

    return images;
  }

  private _getDirPath(blogId: string, type: ImgFileType) {
    return path.resolve(__dirname, '../..', 'static', type, blogId);
  }
}
