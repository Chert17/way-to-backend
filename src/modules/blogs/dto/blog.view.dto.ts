import { ImgData } from '../../../types/img.data.interface';

export class BlogViewDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
  readonly createdAt: string;
  readonly isMembership: boolean;
}

export class BlogViewWithWallpaperDto extends BlogViewDto {
  readonly wallpaper: ImgData;
}

export class BlogViewWithImagesDto extends BlogViewDto {
  readonly images: { wallpaper: ImgData; main: ImgData[] };
}

export class BlogViewBySADto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
  readonly createdAt: string;
  readonly isMembership: boolean;
  readonly blogOwnerInfo: { userId: string; userLogin: string };
  readonly banInfo: { isBanned: boolean; banDate: string | null };
}

export class BanUserByBlogViewDto {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: string;
    banReason: string;
  };
}

export class BlogImgViewDto {
  readonly wallpaper: ImgData | null;
  readonly main: ImgData[];
}
