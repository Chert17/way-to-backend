import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { userController } from '../repositories/users/user.composition';
import { userRequestBodySchema } from '../validation/users/user.request.body.schema';

export const userRouter = express.Router();

userRouter.get('/', userController.getAllUsersController.bind(userController));

userRouter.post(
  '/',
  authMiddleware,
  userRequestBodySchema,
  validateRequestMiddleware,
  userController.createUserController.bind(userController)
);

userRouter.delete(
  '/:id',
  authMiddleware,
  userController.deleteUserController.bind(userController)
);
