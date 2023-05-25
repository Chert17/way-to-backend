import { Module } from '@nestjs/common';

import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepo } from '../comments/repositories/comments.query.repo';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/posts.query.repo';
import { PostsRepo } from './repositories/posts.repo';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsQueryRepo,
    PostsRepo,
    BlogsRepo,
    CommentsService,
    CommentsQueryRepo,
  ],
})
export class PostsModule {}
