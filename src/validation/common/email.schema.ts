import { body } from 'express-validator';

export const emailSchema = body('email')
  .exists({ values: 'falsy' })
  .trim()
  .notEmpty()
  .withMessage('Field is required')
  .isString()
  .matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  .withMessage('Incorrect email');
