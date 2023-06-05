import { IsDefined, IsString } from 'class-validator';

export class createPostServiceDto {
  @IsString()
  @IsDefined()
  readonly blogName: string;

  readonly blogId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}

export class createPostDbDto {
  readonly blogId: string;
  readonly blogName: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}
