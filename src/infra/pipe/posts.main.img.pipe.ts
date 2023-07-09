import sharp from 'sharp';

import { Injectable, PipeTransform } from '@nestjs/common';

import { customBadRequestException } from '../../helpers/exceptions/custom-bad-request';
import { MulterFileType } from '../../types/file.interface';

@Injectable()
export class PostMainImgValidationPipe implements PipeTransform {
  async transform(file: MulterFileType) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      customBadRequestException('file', 'Not supported format');
    }

    if (file.size > 1024) {
      customBadRequestException('file', 'Not supported size');
    }

    const { width, height } = await sharp(file.buffer).metadata();

    console.log({ width, height });

    const sizeConditional = !(
      (width === 149 && height === 96) ||
      (width === 300 && height === 180) ||
      (width === 940 && height === 432)
    );

    if (sizeConditional) {
      customBadRequestException('file', 'Not supported width or height');
    }

    return file;
  }
}
