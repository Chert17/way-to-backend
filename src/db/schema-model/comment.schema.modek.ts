import mongoose from 'mongoose';

import { ICommentsDb } from '../db.types';

const CommentSchema = new mongoose.Schema<ICommentsDb>({
  content: { type: String, require: true, length: { max: 300 } },
  postId: { type: String, require: true },
  commentatorInfo: {
    userId: {
      type: String,
      required: true,
      userLogin: { type: String, required: true },
    },
    createdAt: { type: String, require: true, default: Date.now() },
  },
});

export const CommentModel = mongoose.model<ICommentsDb>(
  'comments',
  CommentSchema
);
