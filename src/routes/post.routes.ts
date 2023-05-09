import express from 'express';

import {
  createCommentByPostIdController,
  createPostController,
  deletePostController,
  getAllCommentsByOnePostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from '../controllers/post.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';
import { postRequestBodySchema } from '../validation/posts/posts.request.body.schema';

export const postRouter = express.Router();

postRouter.get('/', getAllPostsController);

postRouter.get('/:id', getPostByIdController);

postRouter.post(
  '/',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  createPostController
);

postRouter.put(
  '/:id',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  updatePostController
);

postRouter.delete('/:id', authMiddleware, deletePostController);

postRouter.get('/:postId/comments', getAllCommentsByOnePostController);

postRouter.post(
  '/:postId/comments',
  jwtAuthMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  createCommentByPostIdController
);
