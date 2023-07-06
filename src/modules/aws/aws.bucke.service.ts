import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SETTINGS } from '../../utils/settings';
import { UploadFileDto } from './dto/upload.file.dto';

const { POST_MAIN_IMAGES_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = SETTINGS;

@Injectable()
export class AwsS3BucketService implements OnModuleInit {
  private bucketName: string;
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get(POST_MAIN_IMAGES_BUCKET);
    this.s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: this.configService.get(AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(AWS_SECRET_KEY),
      },
    });
  }

  async uploadFile(dto: UploadFileDto) {
    const { Bucket, Key, Body } = dto;

    const command = new PutObjectCommand({ Bucket, Key, Body });

    try {
      const response = await this.s3Client.send(command);
      console.log('SUCCESS UPLOAD FILE', response);
    } catch (err) {
      console.error('ERROR UPLOAD FILE', err);
    }
  }

  async onModuleInit() {
    try {
      // Check if the bucket already exists
      const headBucketCommand = new HeadBucketCommand({
        Bucket: this.bucketName,
      });
      await this.s3Client.send(headBucketCommand);

      console.log('Bucket already exists:', this.bucketName);
    } catch (err) {
      console.log('ERROR Bucket', err);

      // If HEAD request fails, it means the bucket does not exist
      if (err.$metadata.httpStatusCode === 404) {
        // Create a new bucket
        const createBucketCommand = new CreateBucketCommand({
          Bucket: this.bucketName,
        });
        await this.s3Client.send(createBucketCommand);

        console.log('Bucket created successfully:', this.bucketName);
      }
    }
  }
}
