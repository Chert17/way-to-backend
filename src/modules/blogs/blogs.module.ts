import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistBlog } from '../../infra/decorators/blog/exist.blog';
import { JwtService } from '../auth/jwt.service';
import { PostsQueryRepo } from '../posts/repositories/post.query.repo';
import { PostsRepo } from '../posts/repositories/post.repo';
import { UsersRepo } from '../users/repositories/users.repo';
import { BlogsBloggerController } from './api/blogs.blogger.controller';
import { BlogsPublicController } from './api/blogs.public.controller';
import { BlogsSaController } from './api/blogs.sa.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { BlogsQueryRepo } from './repositories/blogs.query.repo';
import { BlogsRepo } from './repositories/blogs.repo';
import { BanBlogBySaUseCase } from './use-case/ban.blog.by.sa.use-case';
import { BanUserByBloggerBlogUseCase } from './use-case/ban.user.byblogger.blog.use-case';
import { CreateBlogUseCase } from './use-case/create.blog.use-case';
import { CreatePostByBlogUseCase } from './use-case/create.post.by.blog.use-case';
import { DeleteBlogUseCase } from './use-case/delete.blog.use-case';
import { DeletePostByBlogUseCase } from './use-case/delete.post.by.blog.use-case';
import { GetAllBanUsersByBloggerBlogUseCase } from './use-case/get.all.ban.users.by.blogger.blog.use-case';
import { GetAllPostsByBlogUseCase } from './use-case/get.all.posts.by.blog.use-case';
import { UpdateBlogUseCase } from './use-case/update.blog.use-case';
import { UpdatePostByBlogUseCase } from './use-case/update.post.by.blog.use-case';
import { UploadBlogWallpaperUseCase } from './use-case/upload.blog.wallpaper.use-case';

@Module({
  controllers: [
    BlogsPublicController,
    BlogsBloggerController,
    BlogsSaController,
  ],
  providers: [
    // service
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    JwtService,
    UsersRepo,
    PostsRepo,
    PostsQueryRepo,
    // use-case
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostByBlogUseCase,
    UpdatePostByBlogUseCase,
    DeletePostByBlogUseCase,
    BanUserByBloggerBlogUseCase,
    GetAllBanUsersByBloggerBlogUseCase,
    BanBlogBySaUseCase,
    GetAllPostsByBlogUseCase,
    UploadBlogWallpaperUseCase,
    // validation
    ExistBlog,
  ],
  imports: [TypeOrmModule.forFeature([Blog]), CqrsModule],
})
export class BlogsModule {}
