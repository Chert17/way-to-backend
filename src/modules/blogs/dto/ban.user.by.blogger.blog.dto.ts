import { IsBoolean, IsDefined, IsString, Validate } from 'class-validator';

import { ExistBlog } from '../../../infra/decorators/blog/exist.blog';
import { Trim } from '../../../infra/decorators/validation/trim';

export class BanUserByBloggerBlogDto {
  @IsBoolean()
  @IsDefined()
  readonly isBanned: true;

  @Trim()
  @IsString()
  readonly banReason: string;

  @Validate(ExistBlog)
  @Trim()
  @IsString()
  readonly blogId: string;
}

export class BanUserByBloggerBlogServiceDto {
  readonly userId: string;
  readonly banUserId: string;
  readonly isBanned: true;
  readonly banReason: string;
  readonly blogId: string;
}

export class BanUserByBloggerBlogDbDto {
  readonly banUserId: string;
  readonly isBanned: true;
  readonly banReason: string;
  readonly banDate: string;
  readonly blogId: string;
}
