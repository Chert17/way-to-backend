import mongoose from 'mongoose';

import { IBlogDb } from '../db.types';

const BlogSchema = new mongoose.Schema<IBlogDb>({
  name: { type: String, require: true, length: { max: 15 } },
  description: { type: String, require: true, length: { max: 500 } },
  websiteUrl: { type: String, require: true, length: { max: 100 } },
  createdAt: { type: String, require: true, default: new Date().toISOString() },
  isMembership: { type: Boolean, require: true },
});

export const BlogModel = mongoose.model<IBlogDb>('blogs', BlogSchema);
