import { Types } from 'mongoose';

export type DbType<T> = T & {
  _id: Types.ObjectId;
};
