import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '../auth/jwt.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { BlogsBloggerController } from './api/blogs.blogger.controller';
import { BlogsPublicController } from './api/blogs.public.controller';
import { BlogsSaController } from './api/blogs.sa.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { BlogsQueryRepo } from './repositories/blogs.query.repo';
import { BlogsRepo } from './repositories/blogs.repo';
import { CreateBlogUseCase } from './use-case/create.blog.use-case';
import { DeleteBlogUseCase } from './use-case/delete.blog.use-case';
import { UpdateBlogUseCase } from './use-case/update.blog.use-case';

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
    // use-case
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Blog]), CqrsModule],
})
export class BlogsModule {}
