export class updatePostServiceDto {
  readonly postId: string;
  readonly blogId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}

export class updatePostDbDto {
  readonly postId: string;
  readonly blogId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}
