import { IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim';

export class CreateBlogDto {
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

export class CreateBlogServiceDto {
  readonly userId: string;
  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
}

export class CreateBlogDbDto {
  readonly userId: string;
  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
  readonly createdAt: string;
}
