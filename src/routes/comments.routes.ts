import { Router } from 'express';

import { checkAuthUserForLikeStatusUserMiddleware } from '../middlewares/checkAuthUserForLikeStatusUserMiddleware';
import { checkUserCanWorkWithCommentMiddleware } from '../middlewares/checkUserCanWorkWithCommentMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { commentController } from '../repositories/comments/comment.composition';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';
import { likeRequestBodySchema } from '../validation/common/like.request.body.schema';

export const commentRouter = Router();

commentRouter.get(
  '/:id',
  checkAuthUserForLikeStatusUserMiddleware,
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

commentRouter.put(
  '/:commentId/like-status',
  jwtAuthMiddleware,
  likeRequestBodySchema,
  validateRequestMiddleware,
  commentController.updateCommentLikeStatus.bind(commentController)
);

commentRouter.delete(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  commentController.deleteComment.bind(commentController)
);
