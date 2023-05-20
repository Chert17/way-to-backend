import mongoose from 'mongoose';

import { LikeStatus } from '../../models/likes.models';
import { IPostDb, IPostsLikesInfoDb } from '../db.types';

const PostLikeInfoSchema = new mongoose.Schema<IPostsLikesInfoDb>(
  {
    userId: { type: String, require: true },
    status: { type: String, enum: LikeStatus, require: true },
    login: { type: String, require: true },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema<IPostDb>({
  title: { type: String, require: true, length: { max: 30 } },
  shortDescription: { type: String, require: true, length: { max: 100 } },
  content: { type: String, require: true, length: { min: 20, max: 1000 } },
  blogId: { type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true, default: new Date().toISOString() },
  extendedLikesInfo: [PostLikeInfoSchema],
});

export const PostModel = mongoose.model<IPostDb>('posts', PostSchema);
