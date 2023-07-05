import sharp from 'sharp';

import { Injectable, PipeTransform } from '@nestjs/common';

import { customBadRequestException } from '../../helpers/exceptions/custom-bad-request';
import { FileType } from '../../types/file.interface';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  async transform(file: FileType) {
    try {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        customBadRequestException('file', 'Not supported format');
      }

      if (file.size > 1024) {
        customBadRequestException('file', 'Not supported size');
      }

      const { width, height } = await sharp(file.buffer).metadata();

      if (width !== 1028) {
        customBadRequestException('file', 'Not supported width');
      }

      if (height !== 312) {
        customBadRequestException('file', 'Not supported height');
      }

      return file;
    } catch (error) {
      console.log(error);
      customBadRequestException('file', 'Not supported format');
    }
  }
}