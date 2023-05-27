import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailModule } from './adapters/email/email.module';
import { EmailService } from './adapters/email/email.service';
import { EmailManagerModule } from './managers/email.manager/email.manager.module';
import { EmailManagerService } from './managers/email.manager/email.manager.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { BlogsController } from './modules/blogs/blogs.controller';
import { Blog, BlogSchema } from './modules/blogs/blogs.schema';
import { BlogsService } from './modules/blogs/blogs.service';
import { BlogsQueryRepo } from './modules/blogs/repositories/blogs.query.repo';
import { BlogsRepo } from './modules/blogs/repositories/blogs.repo';
import { CommentsController } from './modules/comments/comments.controller';
import { Comment, CommentSchema } from './modules/comments/comments.schema';
import { CommentsService } from './modules/comments/comments.service';
import { CommentsQueryRepo } from './modules/comments/repositories/comments.query.repo';
import { CommentsRepo } from './modules/comments/repositories/comments.repo';
import { DeleteAllController } from './modules/delete-all/delete-all.controller';
import { PostsController } from './modules/posts/posts.controller';
import { Post, PostSchema } from './modules/posts/posts.schema';
import { PostsService } from './modules/posts/posts.service';
import { PostsQueryRepo } from './modules/posts/repositories/posts.query.repo';
import { PostsRepo } from './modules/posts/repositories/posts.repo';
import { UsersQueryRepo } from './modules/users/repositories/users.query.repo';
import { UsersRepo } from './modules/users/repositories/users.repo';
import { UsersController } from './modules/users/users.controller';
import { User, UserSchema } from './modules/users/users.schema';
import { UsersService } from './modules/users/users.service';
import { SETTINGS } from './utils/settings';

const controllers = [
  DeleteAllController,
  BlogsController,
  PostsController,
  CommentsController,
  UsersController,
  AuthController,
];

const services = [
  BlogsService,
  PostsService,
  CommentsService,
  UsersService,
  AuthService,
  EmailService,
  EmailManagerService,
];

const queryRepo = [
  BlogsQueryRepo,
  PostsQueryRepo,
  CommentsQueryRepo,
  UsersQueryRepo,
];

const repo = [BlogsRepo, PostsRepo, CommentsRepo, UsersRepo, ...queryRepo];

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: User.name, schema: UserSchema },
];

const modules = [AuthModule, EmailModule, EmailManagerModule];

@Module({
  controllers: [...controllers],
  providers: [...services, ...repo],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(SETTINGS.MONGO_URL, {
      dbName: SETTINGS.DB_NAME,
    }),
    MongooseModule.forFeature(mongooseModels),

    ...modules,
  ],
})
export class AppModule {}
