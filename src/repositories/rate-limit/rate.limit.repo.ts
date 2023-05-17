import { IRateLimitDb } from '../../db/db.types';
import { RateLimitModel } from '../../db/schema-model/rate.limit.schema.model';

export class RateLimitRepo {
  async addRequest({
    ip,
    url,
    date,
  }: IRateLimitDb): Promise<IRateLimitDb | null> {
    try {
      const rateLimit = new RateLimitModel({ ip, url, date });

      const result = await rateLimit.save();

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async getTotalCountRequest({
    ip,
    url,
    date,
  }: IRateLimitDb): Promise<number | null> {
    try {
      const totalCount = await RateLimitModel.countDocuments({
        ip,
        url,
        date: { $gte: date },
      }).lean();

      if (!totalCount) return null;

      return totalCount;
    } catch (error) {
      return null;
    }
  }
}
