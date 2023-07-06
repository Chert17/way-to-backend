import { readdir, readFile } from 'fs/promises';n
import path from 'path';
import sharp from 'sharp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImgData } from '../../types/img.data.interface';
import { SETTINGS } from '../../utils/settings';

const { SERVEO_URL } = SETTINGS;

@Injectable()
export class BlogsService {
  private _baseImgUrl: string;

  constructor(private configService: ConfigService) {
    this._baseImgUrl = this.configService.get(SERVEO_URL);
  }

  async getBlogMainImages(blogId: string): Promise<ImgData[]> {
    const dirPath = this._getPathToBlogMinImages(blogId);

    let mainImgNames: string[];
    try {
      const imagesNames = await readdir(dirPath);
      mainImgNames = imagesNames;
    } catch (error) {
      return;
    }

    return Promise.all(
      mainImgNames.map(async n => {
        const pathToImg = path.join(dirPath, n);
        const buffer = await readFile(pathToImg);

        const { width, height, size } = await sharp(buffer).metadata();
        return {
          url: path.join(this._baseImgUrl, path.join(dirPath, n)),
          width,
          height,
          fileSize: size,
        };
      }),
    );
  }

  _getPathToBlogMinImages(blogId: string) {
    const rootDirPath = path.dirname(require.main.filename);

    return path.join(rootDirPath, 'assets', 'blogs', 'main', `${blogId}`);
  }
}
