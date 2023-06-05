import { Module } from '@nestjs/common';

import { PostsQueryRepo } from '../posts/repositories/posts.query.repo';
import { PostsRepo } from '../posts/repositories/posts.repo';
import { BlogsBloggerController } from './api/blogs.blogger.controller';
import { BlogsController } from './api/blogs.public.controller';
import { BlogsSAController } from './api/blogs.sa.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepo } from './repositories/blogs.query.repo';
import { BlogsRepo } from './repositories/blogs.repo';

@Module({
  controllers: [BlogsController, BlogsBloggerController, BlogsSAController],
  providers: [
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    PostsQueryRepo,
    PostsRepo,
  ],
})
export class BlogsModule {}
