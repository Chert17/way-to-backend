import { MulterFileType } from '../../../types/file.interface';
import { ImgData } from '../../../types/img.data.interface';

export class BlogImgViewDto {
  readonly wallpaper: ImgData;
  readonly main: ImgData[];
}

export class UploadBlogWallpaperDto {
  readonly userId: string;
  readonly blogId: string;
  readonly file: MulterFileType;
}
