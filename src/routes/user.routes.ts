import express from 'express';

import {
  createUserController,
  deleteUserController,
  getAllUsersController,
} from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { userRequestBodySchema } from '../validation/users/user.request.body.schema';

export const userRouter = express.Router();

userRouter.get('/', getAllUsersController);

userRouter.post(
  '/',
  authMiddleware,
  userRequestBodySchema,
  validateRequestMiddleware,
  createUserController
);

userRouter.delete('/:id', authMiddleware, deleteUserController);
