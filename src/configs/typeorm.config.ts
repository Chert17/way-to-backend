import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { BanUsersForBlog } from '../modules/blogs/entities/ban.users.for.blog.entity';
import { Blog } from '../modules/blogs/entities/blog.entity';
import { Comment } from '../modules/comments/entities/comment.entity';
import { Post } from '../modules/posts/entities/post.entity';
import { PostsReactions } from '../modules/posts/entities/post.reaction.entity';
import { BanUser } from '../modules/users/entities/ban.user';
import { ConfirmEmail } from '../modules/users/entities/confirm.email';
import { Device } from '../modules/users/entities/devices';
import { RecoveryPassword } from '../modules/users/entities/recovery.pass';
import { User } from '../modules/users/entities/user.entity';
import { SETTINGS } from '../utils/settings';

@Injectable()
export class TypeOrmConfig {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: this.configService.get(SETTINGS.PG_PORT),
      username: this.configService.get(SETTINGS.PG_USER_NAME),
      password: this.configService.get(SETTINGS.PG_PASS),
      database: this.configService.get(SETTINGS.PG_DB_NAME),
      entities: [
        User,
        BanUser,
        ConfirmEmail,
        RecoveryPassword,
        Device,
        Blog,
        Post,
        BanUsersForBlog,
        Comment,
        PostsReactions,
      ],
      // entities: ['src/modules/**/entity/*.ts'],
      // autoLoadEntities: true,
      synchronize: true,
    };
  }
}
