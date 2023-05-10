import { db } from "./db";
import {
  IBlogDb,
  ICommentsDb,
  IPostDb,
  IUserConfirmEmailDb,
  IUserDb,
  IUserRefreshTokenDb
} from "./db.types";

export const blogsDbCollection = db.collection<IBlogDb>('blogs');

export const postsDbCollection = db.collection<IPostDb>('posts');

export const usersDbCollection = db.collection<IUserDb>('users');

export const userConfirmEmailDbCollection =
  db.collection<IUserConfirmEmailDb>('userConfirmEmail');

export const commentsDbCollection = db.collection<ICommentsDb>('comments');

export const userRefreshTokenCollection =
  db.collection<IUserRefreshTokenDb>('userRefreshToken');
