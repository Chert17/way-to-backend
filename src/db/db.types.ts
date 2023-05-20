import { CommentatorInfo } from '../models/comments.models';
import { LikeStatus } from '../models/likes.models';

export interface IBlogDb {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface IPostsLikesInfoDb {
  userId: string;
  login: string;
  status: LikeStatus;
}

export interface IPostDb {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: IPostsLikesInfoDb[];
}

export interface IUserDb {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isConfirm?: boolean;
}

export interface IUserConfirmEmailDb {
  userId: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirm: boolean;
}

export interface IUserRecoveryPasswordDb {
  userEmail: string;
  confirmationCode: string;
  expirationDate: Date;
}

export interface ICommentsLikesInfoDb {
  userId: string;
  status: LikeStatus;
}

export interface ICommentsDb {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: ICommentsLikesInfoDb[];
}

export interface IUserSecurityDevicesDb {
  userId: string;
  lastActiveDate: Date;
  ip: string;
  deviceName: string;
  deviceId: string;
}

export interface IRateLimitDb {
  ip: string;
  url: string;
  date: Date;
}
