export class UploadFileDto {
  readonly Bucket: string;
  readonly Key: string;
  readonly Body: Buffer;
}
