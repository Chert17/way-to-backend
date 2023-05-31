import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailerConfigService } from './configs/mailer.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { ConfirmCodeExist } from './infra/decorators/auth/confirm.code.exist';
import { ResendingEmailExist } from './infra/decorators/auth/resending.email.exist';
import { ExistUser } from './infra/decorators/users/exist.user';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from './modules/auth/jwt.service';
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
import { MongoModule } from './modules/db-module/mongoose.module';
import { DeleteAllController } from './modules/delete-all/delete-all.controller';
import { EmailService } from './modules/email/email.service';
import { PostsController } from './modules/posts/posts.controller';
import { Post, PostSchema } from './modules/posts/posts.schema';
import { PostsService } from './modules/posts/posts.service';
import { PostsQueryRepo } from './modules/posts/repositories/posts.query.repo';
import { PostsRepo } from './modules/posts/repositories/posts.repo';
import { UsersQueryRepo } from './modules/users/repositories/users.query.repo';
import { UsersRepo } from './modules/users/repositories/users.repo';
import { User, UserSchema } from './modules/users/schemas/users.schema';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';

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
  JwtService,
];

const queryRepo = [
  BlogsQueryRepo,
  PostsQueryRepo,
  CommentsQueryRepo,
  UsersQueryRepo,
];

const repo = [BlogsRepo, PostsRepo, CommentsRepo, UsersRepo, ...queryRepo];

const validators = [
  ConfirmCodeExist,
  ResendingEmailExist,
  ExistUser, //register
];

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: User.name, schema: UserSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forFeature(mongooseModels),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),

    MongoModule, // in modules/db-module , bacause need for test
  ],
  controllers: [...controllers],
  providers: [...validators, ...services, ...repo],
})
export class AppModule {}
