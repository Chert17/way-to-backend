import { IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class UpdateBlogDto {
  @Length(1, 15)
  @Trim()
  @IsString()
  readonly name: string;

  @Length(1, 500)
  @Trim()
  @IsString()
  readonly description: string;

  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @Length(1, 100)
  @Trim()
  @IsString()
  readonly websiteUrl: string;
}
