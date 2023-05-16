import mongoose from 'mongoose';

import { IUserDb } from '../db.types';

const UserSchema = new mongoose.Schema<IUserDb>({
  login: { type: String, require: true, length: { min: 3, max: 10 } },
  email: { type: String, require: true },
  passwordHash: { type: String, require: true },
  createdAt: { type: String, require: true, default: new Date().toISOString() },
  isConfirm: { type: Boolean, require: true },
});

export const UserModel = mongoose.model<IUserDb>('users', UserSchema);
