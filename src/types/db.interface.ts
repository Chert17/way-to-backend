import { MongoId } from './mongo._id.interface';

export type DbType<T> = T & {
  _id: MongoId;
};
