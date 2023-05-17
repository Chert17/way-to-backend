import mongoose from 'mongoose';

import { LikeStatus } from '../../models/likes.models';
import { ICommentsDb, ICommentsLikesInfoDb } from '../db.types';

const CommentLikeInfoSchema = new mongoose.Schema<ICommentsLikesInfoDb>(
  {
    userId: { type: String, require: true },
    status: { type: String, enum: LikeStatus, require: true },
  },
  { timestamps: true }
);

const CommentSchema = new mongoose.Schema<ICommentsDb>({
  content: { type: String, require: true, length: { max: 300 } },
  postId: { type: String, require: true },
  commentatorInfo: {
    userId: {
      type: String,
      required: true,
      userLogin: { type: String, required: true },
    },
  },
  createdAt: { type: String, require: true, default: Date.now().toString() },
  likesInfo: [CommentLikeInfoSchema],
});

export const CommentModel = mongoose.model<ICommentsDb>(
  'comments',
  CommentSchema
);
