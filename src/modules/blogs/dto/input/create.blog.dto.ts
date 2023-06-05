import { IsDefined, IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';
import { MongoId } from '../../../../types/mongo._id.interface';

export class CreateBlogDto {
  @IsString()
  @Length(1, 15)
  @Trim()
  readonly name: string;

  @IsString()
  @Length(1, 500)
  @Trim()
  readonly description: string;

  @IsString()
  @Length(1, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @Trim()
  readonly websiteUrl: string;
}

export class CreateBlogServiceDto {
  @IsDefined()
  userId: MongoId;

  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
}

export class CreateBlogDbDto {
  @IsDefined()
  userId: MongoId;

  readonly name: string;
  readonly description: string;
  readonly websiteUrl: string;
}
