import sharp from 'sharp';

import { Injectable, PipeTransform } from '@nestjs/common';

import { customBadRequestException } from '../../helpers/exceptions/custom-bad-request';
import { MulterFileType } from '../../types/file.interface';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(public widthLimit: number, public heightLimit: number) {}

  async transform(file: MulterFileType) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      customBadRequestException('file', 'Not supported format');
    }

    if (file.size > 100000) {
      customBadRequestException('file', 'Not supported size');
    }

    const { width, height } = await sharp(file.buffer).metadata();

    if (width !== this.widthLimit) {
      customBadRequestException('file', 'Not supported width');
    }

    if (height !== this.heightLimit) {
      customBadRequestException('file', 'Not supported height');
    }

    return file;
  }
}
