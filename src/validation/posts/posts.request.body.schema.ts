import { body } from 'express-validator';
import { blogQueryRepo } from '../../repositories/blogs/blog.query.repo';

export const postRequestBodySchema = [
  body('title')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 30 })
    .withMessage('Fueld must be no more than 30 characters'),

  body('shortDescription')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 100 })
    .withMessage('Field must be no more than 100 characters'),

  body('content')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 1000 })
    .withMessage('Field must be no more than 1000 characters'),

  body('blogId').custom(async (id: string) => {
    const blog = await blogQueryRepo.getBlogById(id);

    if (!blog) throw new Error('Blog with given id not found');
  }),
];
