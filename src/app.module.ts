import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { JwtConfigService } from './configs/jwt.config';
import { MailerConfigService } from './configs/mailer.config';
import { MongooseConfigService } from './configs/mongo.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthRepo } from './modules/auth/repositories/auth.repo';
import {
  ConfirmEmail,
  ConfirmEmailSchema,
} from './modules/auth/schemas/confirm.email.schema';
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
import { EmailService } from './modules/email/email.service';
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
];

const queryRepo = [
  BlogsQueryRepo,
  PostsQueryRepo,
  CommentsQueryRepo,
  UsersQueryRepo,
];

const repo = [
  AuthRepo,
  BlogsRepo,
  PostsRepo,
  CommentsRepo,
  UsersRepo,
  ...queryRepo,
];

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: User.name, schema: UserSchema },
  { name: ConfirmEmail.name, schema: ConfirmEmailSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    MongooseModule.forFeature(mongooseModels),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    PassportModule,
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),
  ],
  controllers: [...controllers],
  providers: [...services, ...repo],
})
export class AppModule {}
