import { body } from 'express-validator';

import { JwtService } from '../../application/jwt.service';
import { EmailManager } from '../../managers/email.managers';
import { AuthRepo } from '../../repositories/auth/auth.repo';
import { TokenRepo } from '../../repositories/auth/token.repo';
import { AuthService } from '../../service/auth.service';

const authRepo = new AuthRepo();
const tokenRepo = new TokenRepo();
const jwtService = new JwtService();
const emailManager = new EmailManager();

const authService = new AuthService(
  authRepo,
  tokenRepo,
  jwtService,
  emailManager
);

export const authRegisterConfirmRequestBodySchema = [
  body('code')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),

  body('code').custom(async (code: string) => {
    const result = await authService.checkConfirmEmail(code);

    if (!result) throw new Error('Inccorect field');
  }),
];
