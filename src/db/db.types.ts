import { CommentatorInfo } from '../models/comments.models';

export interface IBlogDb {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface IPostDb {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface IUserDb {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  isConfirm?: boolean;
}

export interface IUserConfirmEmailDb {
  userId: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirm: boolean;
}

export interface ICommentsDb {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
}
