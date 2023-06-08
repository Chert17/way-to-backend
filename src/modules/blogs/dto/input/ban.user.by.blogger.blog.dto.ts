import { IsBoolean, IsDefined, IsString, Validate } from 'class-validator';

import { ExistBlog } from '../../../../infra/decorators/blogs/exist.blog';
import { ExistUserById } from '../../../../infra/decorators/users/exist.user.by.id';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

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
  @IsString()
  @IsDefined()
  readonly bloggerId: string;

  @Validate(ExistUserById)
  readonly userId: string;

  readonly isBanned: true;
  readonly banReason: string;
  readonly blogId: string;
}

export class BanUserByBloggerBlogDbDto {
  readonly bloggerId: string;
  readonly userId: string;
  readonly isBanned: true;
  readonly banReason: string;
  readonly banDate: Date;
  readonly blogId: string;
}
