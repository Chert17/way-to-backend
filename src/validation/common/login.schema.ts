import { body } from 'express-validator';

export const loginSchema = body('login')
  .exists({ values: 'falsy' })
  .trim()
  .notEmpty()
  .withMessage('Field is required')
  .isString()
  .matches('^[a-zA-Z0-9_-]*$')
  .withMessage('Incorrect login')
  .isLength({ max: 10, min: 3 })
  .withMessage('Fueld must be min 3 and no more 10 characters');
