import { Request, Response, Router } from 'express';

import { BlogModel } from '../db/schema-model/blog.schema.model';
import { CommentModel } from '../db/schema-model/comment.schema.modek';
import { PostModel } from '../db/schema-model/post.schema.model';
import { RateLimitModel } from '../db/schema-model/rate.limit.schema.model';
import { UserConfirmEmailModel } from '../db/schema-model/user.confirm.email.schema.model';
import { UserRecoveryPasswordModel } from '../db/schema-model/user.recovery.password';
import { UserModel } from '../db/schema-model/user.schema.model';
import { UserSecurityDevicesModel } from '../db/schema-model/user.security.device.schema.model';
import { STATUS_CODE } from '../utils/status.code';

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
  await BlogModel.deleteMany();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await CommentModel.deleteMany();
  await UserConfirmEmailModel.deleteMany();
  await UserSecurityDevicesModel.deleteMany();
  await UserRecoveryPasswordModel.deleteMany();
  await RateLimitModel.deleteMany();
  return res.sendStatus(STATUS_CODE.NO_CONTENT);
});
