import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { TestingController } from './testing.controller';

@Module({
  controllers: [TestingController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class TestingModule {}
