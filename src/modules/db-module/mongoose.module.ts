import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigService } from '../../configs/mongo.config';
import { MongoService } from './mongo.service';

@Module({
  imports: [MongooseModule.forRootAsync({ useClass: MongooseConfigService })],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
