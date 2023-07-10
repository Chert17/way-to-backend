import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistBlog } from '../../infra/decorators/blog/exist.blog';
import { JwtService } from '../auth/jwt.service';
import { AwsS3BucketService } from '../aws/aws.bucke.service';
import { FilesService } from '../files/files.service';
import { PostsService } from '../posts/posts.service';
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
import { BlogSubscriptionUseCase } from './use-case/blog.subscription.use-case';
import { CreateBlogUseCase } from './use-case/create.blog.use-case';
import { CreatePostByBlogUseCase } from './use-case/create.post.by.blog.use-case';
import { DeleteBlogUseCase } from './use-case/delete.blog.use-case';
import { DeletePostByBlogUseCase } from './use-case/delete.post.by.blog.use-case';
import { GetAllBanUsersByBloggerBlogUseCase } from './use-case/get.all.ban.users.by.blogger.blog.use-case';
import { GetAllBlogsByUserUseCase } from './use-case/get.all.blogs.by.user.use-case';
import { GetAllBlogsUseCase } from './use-case/get.all.blogs.use-case';
import { GetAllPostsByBlogUseCase } from './use-case/get.all.posts.by.blog.use-case';
import { GetAllPostsByBloggerBlogUseCase } from './use-case/get.all.posts.by.blogger.blog.use-case';
import { GetBlogByIdUseCase } from './use-case/get.blog.by.id.use-case';
import { UpdateBlogUseCase } from './use-case/update.blog.use-case';
import { UpdatePostByBlogUseCase } from './use-case/update.post.by.blog.use-case';
import { UploadBlogMainImgUseCase } from './use-case/upload.blog.main.img.use-case';
import { UploadBlogWallpaperUseCase } from './use-case/upload.blog.wallpaper.use-case';
import { UploadPostMainImgUseCase } from './use-case/upload.post.main.img.use-case';

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
    PostsService,
    FilesService,
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
    UploadBlogMainImgUseCase,
    GetAllBlogsByUserUseCase,
    GetBlogByIdUseCase,
    GetAllBlogsUseCase,
    UploadPostMainImgUseCase,
    GetAllPostsByBloggerBlogUseCase,
    BlogSubscriptionUseCase,
    // validation
    ExistBlog,
    // aws
    AwsS3BucketService,
  ],
  imports: [TypeOrmModule.forFeature([Blog]), CqrsModule],
})
export class BlogsModule {}
