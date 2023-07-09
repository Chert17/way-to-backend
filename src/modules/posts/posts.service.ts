import sharp from 'sharp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImgData } from '../../types/img.data.interface';
import { GetFileDto } from '../aws/dto/get.file.dto';

@Injectable()
export class PostsService {
  constructor(private configService: ConfigService) {}

  async getPostMainImages(files: GetFileDto[]): Promise<ImgData[]> {
    return Promise.all(
      files.map(async f => {
        const { width, height } = await sharp(f.buffer).metadata();

        return { url: f.path, width, height, fileSize: f.size };
      }),
    );
  }
}
