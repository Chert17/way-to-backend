import mongoose from 'mongoose';

import { IUserConfirmEmailDb } from '../db.types';

const UserConfirmEmailSchema = new mongoose.Schema<IUserConfirmEmailDb>({
  userId: { type: String, require: true },
  confirmationCode: { type: String, require: true },
  expirationDate: { type: Date, require: true },
  isConfirm: { type: Boolean, require: true },
});

export const UserConfirmEmailModel = mongoose.model<IUserConfirmEmailDb>(
  'userConfirmEmail',
  UserConfirmEmailSchema
);
