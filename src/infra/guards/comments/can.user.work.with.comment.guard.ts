import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CommentsQueryRepo } from '../../../modules/comments/repositories/comments.query.repo';

@Injectable()
export class CanUserWorkWithComment implements CanActivate {
  constructor(private readonly commentsQueryRepo: CommentsQueryRepo) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const comment = await this.commentsQueryRepo.getCommentById(
      request.params.id,
      null,
    );

    if (!comment) throw new NotFoundException();

    if (request.user.id !== comment.commentatorInfo.userId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
