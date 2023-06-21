import { IsBoolean } from 'class-validator';

export class BanBlogDto {
  @IsBoolean()
  readonly isBanned: boolean;
}

export class BanBlogServiceDto {
  readonly blogId: string;
  readonly isBanned: boolean;
}

export class BanBlogDbDto {
  readonly blogId: string;
  readonly isBanned: boolean;
  readonly banDate: string;
}
