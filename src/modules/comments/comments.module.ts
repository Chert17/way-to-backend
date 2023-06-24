import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '../auth/jwt.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CommentsQueryRepo } from './repositories/comment.query.repo';
import { CommentsRepo } from './repositories/comment.repo';
import { SetLikeInfoByCommentUseCase } from './use-case/comment.like.info.use-case';
import { UpdateCommentUseCase } from './use-case/update.comment.use-case';

@Module({
  controllers: [CommentsController],
  providers: [
    // service
    CommentsService,
    CommentsQueryRepo,
    CommentsRepo,
    JwtService,
    UsersRepo,
    // use-case
    SetLikeInfoByCommentUseCase,
    UpdateCommentUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
})
export class CommentsModule {}
