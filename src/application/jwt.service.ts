import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { SETTINGS } from '../utils/settings';

const { JWT_SECRET } = SETTINGS;

export const jwtService = {
  createJWT: async (userId: ObjectId): Promise<string> => {
    return sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  },

  getUSerIdByToken: async (accessToken: string): Promise<ObjectId | null> => {
    try {
      const result = verify(accessToken, JWT_SECRET) as { userId: ObjectId };

      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
