import { WithId } from 'mongodb';

import { ICommentsDb } from '../db/db.types';
import { converterComment } from '../helpers/converterToValidFormatData/converter.comment';
import { CommentViewModel } from '../models/comments.models';
import { LikeStatus } from '../models/likes.models';
import { CommentQueryRepo } from '../repositories/comments/comment.query.repo';
import { CommentRepo } from '../repositories/comments/comment.repo';
import { userQueryRepo } from '../repositories/users/user.composition';
import { UserQueryRepo } from '../repositories/users/user.query.repo';

export class CommentService {
  constructor(
    protected userQueryRepo: UserQueryRepo,
    protected commentRepo: CommentRepo,
    protected commentQueryRepo: CommentQueryRepo
  ) {}

  async createComment(
    content: string,
    postId: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    const user = await userQueryRepo.getUserById(userId);

    if (!user) return null;
    console.log('QWEQWEQWEQW', user.login);

    const newComment: ICommentsDb = {
      content,
      postId,
      commentatorInfo: { userId: user.id, userLogin: user.login },
      createdAt: new Date().toISOString(),
      likesInfo: [],
    };

    const result = await this.commentRepo.createComment(newComment);

    return result ? converterComment(result) : null;
  }

  async updateComment(
    commentId: string,
    content: string
  ): Promise<WithId<ICommentsDb> | null> {
    return await this.commentRepo.updateComment(commentId, content);
  }

  async updateCommentLikeStatus(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    return await this.commentRepo.updateCommentLikeInfo(
      commentId,
      likeStatus,
      userId
    );
  }

  async deleteComment(commentId: string): Promise<WithId<ICommentsDb> | null> {
    return await this.commentRepo.deleteComment(commentId);
  }
}
