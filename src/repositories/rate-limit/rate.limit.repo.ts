import { ObjectId } from "mongodb";

import { rateLimitCollection } from "../../db/db.collections";
import { IRateLimitDb } from "../../db/db.types";

export const rateLimitRepo = {
  addRequest: async ({
    ip,
    url,
    date,
  }: IRateLimitDb): Promise<ObjectId | null> => {
    try {
      const result = await rateLimitCollection.insertOne({ ip, url, date });

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },

  getTotalCountRequest: async ({
    ip,
    url,
    date,
  }: IRateLimitDb): Promise<number | null> => {
    try {
      const totalCount = await rateLimitCollection.countDocuments({
        ip,
        url,
        date: { $gte: date },
      });

      if (!totalCount) return null;

      return totalCount;
    } catch (error) {
      return null;
    }
  },
};
