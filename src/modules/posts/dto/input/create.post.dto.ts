import { IsString } from 'class-validator';

export class createPostDto {
  @IsString()
  readonly blogId: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly shortDescription: string;

  @IsString()
  readonly title: string;
}
