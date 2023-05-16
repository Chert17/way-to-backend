import mongoose from 'mongoose';

import { IUserRecoveryPasswordDb } from '../db.types';

const UserRecoveryPasswordSchema = new mongoose.Schema<IUserRecoveryPasswordDb>(
  {
    userEmail: { type: String, require: true },
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
  }
);

export const UserRecoveryPasswordModel =
  mongoose.model<IUserRecoveryPasswordDb>(
    'userRecoveryPassword',
    UserRecoveryPasswordSchema
  );
