import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class createCommentDto {
  @Length(20, 300)
  @IsString()
  @Trim()
  readonly content: string;
}

export class CreateCommentServiceDto {
  @Length(20, 300)
  @IsString()
  @Trim()
  readonly content: string;

  @IsString()
  readonly postId: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly userLogin: string;
}
