export class GetFileDto {
  readonly path: string;
  readonly size: number;
  readonly buffer: Buffer;
}
