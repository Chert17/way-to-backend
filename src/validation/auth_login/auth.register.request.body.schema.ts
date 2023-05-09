import { body } from 'express-validator';

import { userQueryRepo } from '../../repositories/users/user.query.repo';
import { emailSchema } from '../common/email.schema';
import { loginSchema } from '../common/login.schema';
import { passwordSchema } from '../common/password.schema';

export const authRegisterRequestBodySchema = [
  emailSchema,
  loginSchema,
  passwordSchema,

  body('login').custom(async (login: string) => {
    const isAlreadyUserByLogin = await userQueryRepo.checkUserCredentials(
      login
    );
    if (isAlreadyUserByLogin) throw new Error('Inccorect field');
  }),

  body('email').custom(async (email: string) => {
    const isAlreadyUserByEmail = await userQueryRepo.checkUserCredentials(
      email
    );
    if (isAlreadyUserByEmail) throw new Error('Inccorect field');
  }),
];
