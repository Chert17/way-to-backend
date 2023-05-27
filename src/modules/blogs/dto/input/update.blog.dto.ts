import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  readonly blogId: string;

  @IsString()
  @Length(1, 15)
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsString()
  @Length(1, 500)
  @Transform(({ value }) => value.trim())
  readonly description: string;

  @IsString()
  @Length(1, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @Transform(({ value }) => value.trim())
  readonly websiteUrl: string;
}
