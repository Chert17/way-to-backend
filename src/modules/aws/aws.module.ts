import { Module } from '@nestjs/common';

import { AwsS3BucketService } from './aws.bucke.service';

@Module({
  providers: [
    // service
    AwsS3BucketService,
  ],
})
export class AwsModule {}
