import path from 'path';
import sharp from 'sharp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImgData } from '../../types/img.data.interface';
import { GetFileDto } from '../aws/dto/get.file.dto';

@Injectable()
export class PostsService {
  private _baseImgUrl: string;

  constructor(private configService: ConfigService) {}
  async getPostMainImages(files: GetFileDto[]): Promise<ImgData[]> {
    return Promise.all(
      files.map(async f => {
        const url = path.join(this._baseImgUrl, f.path);

        const { width, height } = await sharp(f.buffer).metadata();

        return { url, width, height, fileSize: f.size };
      }),
    );
  }
}
