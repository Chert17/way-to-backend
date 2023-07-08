import path from 'path';

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerConfigService } from './configs/mailer.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { TypeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { AwsModule } from './modules/aws/aws.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CommentsModule } from './modules/comments/comments.module';
import { DevicesModule } from './modules/devices/devices.module';
import { EmailModule } from './modules/email/email.module';
import { FilesModule } from './modules/files/files.module';
import { PostsModule } from './modules/posts/posts.module';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
      serveStaticOptions: { index: false },
    }),
    // CqrsModule,

    TestingModule,
    UsersModule,
    AuthModule,
    EmailModule,
    DevicesModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    AwsModule,
    FilesModule,
  ],

  // providers: [...controllers, ...services, ...repositories, ...useCase],
})
export class AppModule {}
