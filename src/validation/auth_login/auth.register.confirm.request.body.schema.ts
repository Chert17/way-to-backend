import { body } from "express-validator";

import { authService } from "../../service/auth.service";

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
