import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class updatePostDto {
  @IsString()
  readonly postId: string;

  @IsString()
  readonly blogId: string;

  @IsString()
  @Length(1, 30)
  @Trim()
  readonly title: string;

  @IsString()
  @Length(1, 100)
  @Trim()
  readonly shortDescription: string;

  @IsString()
  @Length(1, 1000)
  @Trim()
  readonly content: string;
}
