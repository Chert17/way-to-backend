import path from 'path';
import sharp from 'sharp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImgData } from '../../types/img.data.interface';
import { SETTINGS } from '../../utils/settings';
import { AwsS3BucketService } from '../aws/aws.bucke.service';
import { GetFileDto } from '../aws/dto/get.file.dto';

const { POST_MAIN_IMAGES_BUCKET } = SETTINGS;

@Injectable()
export class PostsService {
  constructor(
    private awsS3BucketService: AwsS3BucketService,
    private configService: ConfigService,
  ) {}

  async getPostMainImages(files: GetFileDto[]): Promise<ImgData[]> {
    return Promise.all(
      files.map(async f => {
        const { width, height } = await sharp(f.buffer).metadata();

        return { url: f.path, width, height, fileSize: f.size };
      }),
    );
  }

  async getPostImages(postId: string) {
    const Bucket = this.configService.get(POST_MAIN_IMAGES_BUCKET);

    const files = await this.awsS3BucketService.getFiles(
      Bucket,
      path.join(postId),
    );

    const mainImages = await this.getPostMainImages(files);

    return { main: mainImages };
  }
}
