import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { checkAuthUserForLikeStatusUserMiddleware } from '../middlewares/checkAuthUserForLikeStatusUserMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { postController } from '../repositories/posts/post.composition';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';
import { likeRequestBodySchema } from '../validation/common/like.request.body.schema';
import { postRequestBodySchema } from '../validation/posts/posts.request.body.schema';

export const postRouter = express.Router();

postRouter.get(
  '/',
  checkAuthUserForLikeStatusUserMiddleware,
  postController.getAllPosts.bind(postController)
);

postRouter.get(
  '/:id',
  checkAuthUserForLikeStatusUserMiddleware,
  postController.getPostById.bind(postController)
);

postRouter.get(
  '/:postId/comments',
  checkAuthUserForLikeStatusUserMiddleware,
  postController.getAllCommentsByOnePost.bind(postController)
);

postRouter.post(
  '/',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  postController.createPost.bind(postController)
);

postRouter.post(
  '/:postId/comments',
  jwtAuthMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  postController.createCommentByPostId.bind(postController)
);

postRouter.put(
  '/:id',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  postController.updatePost.bind(postController)
);

postRouter.put(
  '/:postId/like-status',
  jwtAuthMiddleware,
  likeRequestBodySchema,
  validateRequestMiddleware,
  postController.updatePostLikeStatus.bind(postController)
);

postRouter.delete(
  '/:id',
  authMiddleware,
  postController.deletePost.bind(postController)
);
