import express from 'express';

import {
  createBlogController,
  createPostByBlogIdController,
  deleteBlogController,
  getAllBlogsController,
  getAllPostsByOneBlogController,
  getBlogByIdController,
  updateBlogController,
} from '../controllers/blog.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { blogRequestBodySchema } from '../validation/blogs/blog.request.body.schema';
import { requestPostBodyByOneBlogIdSchema } from '../validation/blogs/request.body.by.one.blog.validation';

export const blogRouter = express.Router();

blogRouter.get('/', getAllBlogsController);

blogRouter.get('/:id', getBlogByIdController);

blogRouter.get('/:blogId/posts', getAllPostsByOneBlogController);

blogRouter.put(
  '/:id',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  updateBlogController
);

blogRouter.delete('/:id', authMiddleware, deleteBlogController);

blogRouter.post(
  '/',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  createBlogController
);

blogRouter.post(
  '/:blogId/posts',
  authMiddleware,
  requestPostBodyByOneBlogIdSchema,
  validateRequestMiddleware,
  createPostByBlogIdController
);
