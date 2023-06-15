import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim';

export class BanUserDto {
  @IsBoolean()
  readonly isBanned: boolean;

  @Length(20)
  @Trim()
  @IsString()
  @IsOptional()
  readonly banReason: string | null;
}

export class BanUserServiceDto {
  readonly userId: string;
  readonly isBanned: boolean;
  readonly banReason: string;
}

export class BanUserDbDto {
  readonly userId: string;
  readonly isBanned: boolean;
  readonly banReason: string | null;
  readonly banDate: string | null;
}
