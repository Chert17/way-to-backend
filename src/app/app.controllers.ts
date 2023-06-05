import { AuthController } from '../modules/auth/auth.controller';
import { BlogsBloggerController } from '../modules/blogs/api/blogs.blogger.controller';
import { BlogsController } from '../modules/blogs/api/blogs.public.controller';
import { BlogsSAController } from '../modules/blogs/api/blogs.sa.controller';
import { CommentsController } from '../modules/comments/comments.controller';
import { DeleteAllController } from '../modules/delete-all/delete-all.controller';
import { DevicesController } from '../modules/devices/devices.controller';
import { PostsController } from '../modules/posts/posts.controller';
import { UsersSAController } from '../modules/users/api/users.sa.controller';

export const controllers = [
  DeleteAllController,
  BlogsController,
  BlogsBloggerController,
  BlogsSAController,
  PostsController,
  CommentsController,
  UsersSAController,
  AuthController,
  DevicesController,
];
