import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import { SETTINGS } from '../utils/settings';

dotenv.config();

const mongoUri = SETTINGS.MONGO_URL || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);
export const db = client.db('hw-03');

export const runDB = async () => {
  try {
    await client.connect();
    console.log('DB Connected successfully');
  } catch {
    console.log('! DB Not connect to server');
    await client.close();
  }
};
