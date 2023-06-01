import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class CreatePostByBlogDto {
  @Length(1, 30)
  @Trim()
  @IsString()
  readonly title: string;

  @Length(1, 100)
  @Trim()
  @IsString()
  readonly shortDescription: string;

  @Length(1, 1000)
  @Trim()
  @IsString()
  readonly content: string;
}
