import { AuthService } from '../modules/auth/auth.service';
import { JwtService } from '../modules/auth/jwt.service';
import { BlogsService } from '../modules/blogs/blogs.service';
import { CommentsService } from '../modules/comments/comments.service';
import { DevicesService } from '../modules/devices/devices.service';
import { EmailService } from '../modules/email/email.service';
import { PostsService } from '../modules/posts/posts.service';
import { UsersService } from '../modules/users/users.service';

export const services = [
  BlogsService,
  PostsService,
  CommentsService,
  UsersService,
  AuthService,
  EmailService,
  JwtService,
  DevicesService,
];
