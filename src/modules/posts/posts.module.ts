import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '../auth/jwt.service';
import { Blog } from '../blogs/entities/blog.entity';
import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { CommentsQueryRepo } from '../comments/repositories/comment.query.repo';
import { CommentsRepo } from '../comments/repositories/comment.repo';
import { UsersRepo } from '../users/repositories/users.repo';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/post.query.repo';
import { PostsRepo } from './repositories/post.repo';
import { CreateCommentByPostUseCase } from './use-case/create.comment.by.post.use-case';
import { GetAllCommentsByPostUseCase } from './use-case/get.all.comments.by.post.use-case';
import { SetLikeInfoByPostUseCase } from './use-case/post.like.info.use-case';

@Module({
  controllers: [PostsController],
  providers: [
    // service
    PostsService,
    PostsQueryRepo,
    PostsRepo,
    JwtService,
    BlogsRepo,
    UsersRepo,
    CommentsQueryRepo,
    CommentsRepo,
    // use-case
    CreateCommentByPostUseCase,
    SetLikeInfoByPostUseCase,
    GetAllCommentsByPostUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Post, Blog]), CqrsModule],
})
export class PostsModule {}
