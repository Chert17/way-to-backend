import { body } from 'express-validator';

import { authRepo } from '../../repositories/auth/auth.composition';

export const recoveryPasswordRequestBodySchema = [
  body('newPassword')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 20, min: 6 })
    .withMessage('Field must be min 6 and no more 20 characters'),

  body('recoveryCode')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),

  body('recoveryCode').custom(async (recoveryCode: string) => {
    const result = await authRepo.getRecoveryPasswordDateByCode(recoveryCode);

    if (!result) throw new Error('Inccorect field'); //codes not match

    if (result.expirationDate < new Date()) throw new Error('Inccorect field'); // expirationDate limit exhausted

    if (!result) throw new Error('Inccorect field');
  }),
];
