import { IsBoolean, IsDefined, IsString, Validate } from 'class-validator';

import { ExistUserById } from '../../../../infra/decorators/users/exist.user.by.id';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class BanUserByBloggerBlogDto {
  @IsBoolean()
  @IsDefined()
  readonly isBanned: true;

  @Trim()
  @IsString()
  readonly banReason: string;

  @Trim()
  @IsString()
  readonly blogId: string;
}

export class BanUserByBloggerBlogServiceDto {
  @Validate(ExistUserById)
  readonly userId: string;

  readonly isBanned: true;
  readonly banReason: string;
  readonly blogId: string;
}

export class BanUserByBloggerBlogDbDto {
  readonly userId: string;
  readonly isBanned: true;
  readonly banReason: string;
  readonly banDate: Date;
  readonly blogId: string;
}
