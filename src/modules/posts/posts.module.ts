import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { CreatePostByBlogUseCase } from '../blogs/use-case/create.post.by.blog.use-case';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/post.query.repo';
import { PostsRepo } from './repositories/post.repo';

@Module({
  controllers: [PostsController],
  providers: [
    // service
    PostsService,
    PostsQueryRepo,
    PostsRepo,
    BlogsRepo,
    // use-case
    CreatePostByBlogUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Post]), CqrsModule],
})
export class PostsModule {}
