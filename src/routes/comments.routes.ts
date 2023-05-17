import { Router } from 'express';

import { checkUserCanWorkWithCommentMiddleware } from '../middlewares/checkUserCanWorkWithCommentMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { commentController } from '../repositories/comments/comment.composition';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';

export const commentRouter = Router();

commentRouter.get(
  '/:id',
  commentController.getCommentById.bind(commentController)
);

commentRouter.put(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  commentController.updateComment.bind(commentController)
);

commentRouter.delete(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  commentController.deleteComment.bind(commentController)
);
