import { ConfirmCodeExist } from '../infra/decorators/auth/confirm.code.exist';
import { ResendingEmailExist } from '../infra/decorators/auth/resending.email.exist';
import { ExistBlog } from '../infra/decorators/blogs/exist.blog';
import { ExistUser } from '../infra/decorators/users/exist.user';

export const validators = [
  ConfirmCodeExist,
  ResendingEmailExist,
  ExistUser, //register //
  ExistBlog,
];
