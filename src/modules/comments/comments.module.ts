import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsQueryRepo } from './repositories/comments.query.repo';
import { CommentsRepo } from './repositories/comments.repo';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsQueryRepo, CommentsRepo],
})
export class CommentsModule {}
