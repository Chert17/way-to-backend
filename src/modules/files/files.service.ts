import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { MulterFileType } from '../../types/file.interface';
import { ImgFileType } from './types/img.file.type';

@Injectable()
export class FilesService {
  uploadFile(file: MulterFileType, type: ImgFileType) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = randomUUID() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', type);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
