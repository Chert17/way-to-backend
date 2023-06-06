import { IsBoolean, IsDefined, IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class BanUserDto {
  @IsBoolean()
  readonly isBanned: boolean;

  @Length(20)
  @Trim()
  @IsString()
  readonly banReason: string;
}

export class BanUserServiceDto {
  @IsDefined()
  readonly userId: string;

  readonly isBanned: boolean;
  readonly banReason: string;
}

export class BanUserDbDto {
  readonly userId: string;
  readonly isBanned: boolean;
  readonly banReason: string;
  readonly banDate: Date | null;
}
