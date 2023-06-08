import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class BanBlogDto {
  @IsBoolean()
  @IsDefined()
  readonly isBanned: boolean;
}

export class BanBlogServiceDto {
  @IsString()
  @IsDefined()
  readonly blogId: string;

  readonly isBanned: boolean;
}

export class BanBlogDbDto {
  readonly blogId: string;
  readonly isBanned: boolean;
}
