import { Model, Types, UpdateWriteOpResult } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MongoId } from '../../../types/mongo._id.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { Comment } from '../comments.schema';
import { CommentsLikeStatusDbDto } from '../dto/input/comment.like.status.db';

@Injectable()
export class CommentsRepo {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createComment(newComment: Comment): Promise<MongoId> {
    const result = await this.commentModel.create(newComment);

    return result._id;
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

  async updateLikeInfo(dto: CommentsLikeStatusDbDto): Promise<boolean> {
    const { commentId, likeStatus, userId } = dto;

    const comment = await this.commentModel.findById(commentId);

    const likeInfo = comment.likesInfo.find(i => i.userId === userId);

    if (!likeInfo) {
      comment.likesInfo.push({ userId, status: likeStatus, isBanned: false });
    } else likeInfo.status = likeStatus;

    comment.save();

    return true;
  }

  async updateBanUserInfo(userId: string, isBanned: boolean) {
    return await this.commentModel.updateMany(
      {
        $and: [
          { 'commentatorInfo.userId': userId },
          { likesInfo: { $elemMatch: { userId } } },
        ],
      },
      {
        $set: {
          'commentatorInfo.isBanned': isBanned,
          'likesInfo.$.isBanned': isBanned,
        },
      },
    );
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
