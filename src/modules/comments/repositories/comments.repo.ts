import { Model, Types, UpdateWriteOpResult } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { Comment } from '../comments.schema';
import { CommentsLikeStatusDbDto } from '../dto/input/comment.like.status.db';

@Injectable()
export class CommentsRepo {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createComment(newComment: Comment): Promise<DbType<Comment>> {
    return await this.commentModel.create(newComment);
  }

  async updateComment(
    commentId: string,
    content: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.commentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      { content },
    );
  }

  async updateLikeInfo(dto: CommentsLikeStatusDbDto): Promise<void> {
    const { commentId, likeStatus, userId } = dto;

    const comment = await this.commentModel.findById(commentId);

    const likeInfo = comment.likesInfo.find(i => i.userId === userId);

    if (!likeInfo) {
      comment.likesInfo.push({ userId, status: likeStatus });
    } else likeInfo.status = likeStatus;

    comment.save();
  }

  async deleteComment(commentId: string) {
    return await this.commentModel.deleteOne({
      _id: new Types.ObjectId(commentId),
    });
  }

  async checkCommentById(commentId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(commentId);

    if (!convertId) return false;

    const comment = await this.commentModel.countDocuments({ _id: convertId });

    return !!comment;
  }
}
