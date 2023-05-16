import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { blogController } from '../repositories/blogs/blog.composition';
import { blogRequestBodySchema } from '../validation/blogs/blog.request.body.schema';
import { requestPostBodyByOneBlogIdSchema } from '../validation/blogs/request.body.by.one.blog.validation';

export const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs.bind(blogController));

blogRouter.get('/:id', blogController.getBlogById.bind(blogController));

blogRouter.get(
  '/:blogId/posts',
  blogController.getAllPostsByOneBlog.bind(blogController)
);

blogRouter.post(
  '/',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  blogController.createBlog.bind(blogController)
);

blogRouter.post(
  '/:blogId/posts',
  authMiddleware,
  requestPostBodyByOneBlogIdSchema,
  validateRequestMiddleware,
  blogController.createPostByBlogId.bind(blogController)
);

blogRouter.put(
  '/:id',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  blogController.updateBlog.bind(blogController)
);

blogRouter.delete(
  '/:id',
  authMiddleware,
  blogController.deleteBlog.bind(blogController)
);
