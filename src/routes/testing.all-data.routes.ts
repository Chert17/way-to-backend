import { Request, Response, Router } from 'express';

import { BlogModel } from '../db/schema-model/blog.schema.model';
import { CommentModel } from '../db/schema-model/comment.schema.modek';
import { PostModel } from '../db/schema-model/post.schema.model';
import { RateLimitModel } from '../db/schema-model/rate.limit.schema.model';
import { UserConfirmEmailModel } from '../db/schema-model/user.confirm.email.schema.model';
import { UserModel } from '../db/schema-model/user.schema.model';
import { UserSecurityDevicesModel } from '../db/schema-model/user.security.device.schema.model';
import { STATUS_CODE } from '../utils/status.code';

export const testingRouter = Router();

testingRouter.delete('/', (req: Request, res: Response) => {
  BlogModel.deleteMany();
  PostModel.deleteMany();
  UserModel.deleteMany();
  CommentModel.deleteMany();
  UserConfirmEmailModel.deleteMany();
  UserSecurityDevicesModel.deleteMany();
  RateLimitModel.deleteMany();
  return res.sendStatus(STATUS_CODE.NO_CONTENT);
});
