import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsQueryRepo } from './repositories/comment.query.repo';
import { CommentsRepo } from './repositories/comment.repo';

@Module({
  controllers: [CommentsController],
  providers: [
    // service
    CommentsService,
    CommentsQueryRepo,
    CommentsRepo,
  ],
})
export class CommentsModule {}
