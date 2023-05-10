import { sign, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { TokensViewModel } from "../models/auth.models";
import { SETTINGS } from "../utils/settings";

const { JWT_SECRET } = SETTINGS;

export const jwtService = {
  createJWT: async (userId: ObjectId): Promise<TokensViewModel | null> => {
    try {
      const accessToken = sign({ userId }, JWT_SECRET, { expiresIn: '1m' });
      const refreshToken = sign({ userId }, JWT_SECRET, { expiresIn: '5m' });

      return { accessToken, refreshToken };
    } catch (error) {
      return null;
    }
  },

  getUserIdByToken: async (token: string): Promise<ObjectId | null> => {
    try {
      const result = verify(token, JWT_SECRET) as { userId: ObjectId };

      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
