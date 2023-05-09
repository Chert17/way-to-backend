import { body } from 'express-validator';

export const commentRequestBodySchema = [
  body('content')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .isLength({ min: 20, max: 300 })
    .withMessage('Fueld must be min 20 and no more 300 characters'),
];
