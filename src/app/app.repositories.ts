import { BlogsQueryRepo } from '../modules/blogs/repositories/blogs.query.repo';
import { BlogsRepo } from '../modules/blogs/repositories/blogs.repo';
import { CommentsQueryRepo } from '../modules/comments/repositories/comments.query.repo';
import { CommentsRepo } from '../modules/comments/repositories/comments.repo';
import { DevicesQueryRepo } from '../modules/devices/repositories/devices.query.repo';
import { DevicesRepo } from '../modules/devices/repositories/devices.repo';
import { PostsQueryRepo } from '../modules/posts/repositories/posts.query.repo';
import { PostsRepo } from '../modules/posts/repositories/posts.repo';
import { UsersQueryRepo } from '../modules/users/repositories/users.query.repo';
import { UsersRepo } from '../modules/users/repositories/users.repo';

const queryRepo = [
  BlogsQueryRepo,
  PostsQueryRepo,
  CommentsQueryRepo,
  UsersQueryRepo,
  DevicesQueryRepo,
];

export const repo = [
  BlogsRepo,
  PostsRepo,
  CommentsRepo,
  UsersRepo,
  DevicesRepo,
  ...queryRepo,
];
