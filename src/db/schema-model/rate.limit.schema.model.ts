import mongoose from 'mongoose';

import { IRateLimitDb } from '../db.types';

const RateLimitSchema = new mongoose.Schema<IRateLimitDb>({
  ip: { type: String, require: true },
  url: { type: String, require: true },
  date: { type: Date, require: true },
});

export const RateLimitModel = mongoose.model<IRateLimitDb>(
  'rateLimit',
  RateLimitSchema
);
