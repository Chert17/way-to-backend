import mongoose from 'mongoose';

import { IPostDb } from '../db.types';

const PostSchema = new mongoose.Schema<IPostDb>({
  title: { type: String, require: true, length: { max: 30 } },
  shortDescription: { type: String, require: true, length: { max: 100 } },
  content: { type: String, require: true, length: { min: 20, max: 1000 } },
  blogId: { type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true, default: new Date().toISOString() },
});

export const PostModel = mongoose.model<IPostDb>('posts', PostSchema);
