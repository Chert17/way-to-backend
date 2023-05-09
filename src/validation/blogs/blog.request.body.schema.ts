import { body } from 'express-validator';

export const blogRequestBodySchema = [
  body('websiteUrl')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
    .withMessage('Incorrect url')
    .isLength({ max: 100 })
    .withMessage('Field must be no more than 100 characters'),

  body('name')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 15 })
    .withMessage('Fueld must be no more than 15 characters'),

  body('description')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 500 })
    .withMessage('Field must be no more than 500 characters'),
];
