import { body } from 'express-validator';

import { AuthRepo } from '../../repositories/auth/auth.repo';
import { userQueryRepo } from '../../repositories/users/user.composition';
import { emailSchema } from '../common/email.schema';

const authRepo = new AuthRepo();

export const authResendingRequestBodySchema = [
  emailSchema,

  body('email').custom(async (email: string) => {
    const user = await userQueryRepo.getUserByEmail(email);

    if (!user) throw new Error('Inccorect field'); // user not found

    const confirmEmail = await authRepo.getConfirmEmailByUserId(user.id);

    if (!confirmEmail) throw new Error('Inccorect field'); // not found confirm email data for this user

    if (confirmEmail.isConfirm === true) throw new Error('Inccorect field'); // user already confirmed
  }),
];
