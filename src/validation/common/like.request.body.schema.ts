import { body } from 'express-validator';

import { LikeStatus } from '../../models/likes.models';

export const likeRequestBodySchema = [
  body('likeStatus')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required')
    .isIn(Object.values(LikeStatus))
    .withMessage('Invalid value'),
];
