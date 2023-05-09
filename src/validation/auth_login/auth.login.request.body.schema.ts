import { body } from 'express-validator';
import { passwordSchema } from '../common/password.schema';

export const authLoginRequestBodySchema = [
  body('loginOrEmail')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),

  passwordSchema,
];
