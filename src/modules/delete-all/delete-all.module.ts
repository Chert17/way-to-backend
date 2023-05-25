import { Module } from '@nestjs/common';

import { DeleteAllController } from './delete-all.controller';

@Module({
  controllers: [DeleteAllController],
})
export class DeleteAllModule {}
