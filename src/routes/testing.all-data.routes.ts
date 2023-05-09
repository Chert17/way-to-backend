import { Request, Response, Router } from 'express';

import {
  blogsDbCollection,
  commentsDbCollection,
  postsDbCollection,
  userConfirmEmailDbCollection,
  usersDbCollection,
} from '../db/db.collections';
import { STATUS_CODE } from '../utils/status.code';

export const testingRouter = Router();

testingRouter.delete('/', (req: Request, res: Response) => {
  blogsDbCollection.deleteMany();
  postsDbCollection.deleteMany();
  usersDbCollection.deleteMany();
  commentsDbCollection.deleteMany();
  userConfirmEmailDbCollection.deleteMany();
  return res.sendStatus(STATUS_CODE.NO_CONTENT);
});
