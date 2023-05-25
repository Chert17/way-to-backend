import { Module } from '@nestjs/common';

import { PostsQueryRepo } from '../posts/repositories/posts.query.repo';
import { PostsRepo } from '../posts/repositories/posts.repo';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepo } from './repositories/blogs.query.repo';
import { BlogsRepo } from './repositories/blogs.repo';

@Module({
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    PostsQueryRepo,
    PostsRepo,
  ],
})
export class BlogsModule {}
