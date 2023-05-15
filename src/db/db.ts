import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { SETTINGS } from '../utils/settings';

dotenv.config();

const mongoUri = SETTINGS.MONGO_URL || 'mongodb://0.0.0.0:27017/hw-03';

export const runDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('DB Connected successfully');
  } catch {
    console.log('! DB Not connect to server');
    await mongoose.disconnect();
  }
};
