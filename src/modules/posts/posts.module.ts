import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '../auth/jwt.service';
import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/post.query.repo';
import { PostsRepo } from './repositories/post.repo';
import { GetPostsByIdUseCase } from './use-case/get.post.by.id.use-case';

@Module({
  controllers: [PostsController],
  providers: [
    // service
    PostsService,
    PostsQueryRepo,
    PostsRepo,
    JwtService,
    BlogsRepo,
    // use-case
    GetPostsByIdUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Post]), CqrsModule],
})
export class PostsModule {}
