import { body } from 'express-validator';

export const passwordSchema = body('password')
  .exists({ values: 'falsy' })
  .trim()
  .notEmpty()
  .withMessage('Field is required')
  .isString()
  .withMessage('Field must be a string')
  .isLength({ max: 20, min: 6 })
  .withMessage('Field must be min 6 and no more 20 characters');
