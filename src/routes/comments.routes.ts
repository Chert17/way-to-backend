import { Router } from 'express';

import {
  deleteCommentController,
  getCommentByIdController,
  updateCommentController,
} from '../controllers/comment.controllers';
import { checkUserCanWorkWithCommentMiddleware } from '../middlewares/checkUserCanWorkWithCommentMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';

export const commentRouter = Router();

commentRouter.get('/:id', getCommentByIdController);

commentRouter.put(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  updateCommentController
);

commentRouter.delete(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  deleteCommentController
);
