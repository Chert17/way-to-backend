import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../../infra/decorators/params/req.user.decorator';
import { UserId } from '../../../infra/decorators/params/req.userId.decorator';
import { JwtAuthGuard } from '../../../infra/guards/jwt.auth.guard';
import { UserIdFromToken } from '../../../infra/guards/userId.from.token.guard';
import { ReqUserIdType } from '../../../types/req.user.interface';
import {
  BlogQueryPagination,
  PostQueryPagination,
} from '../../../utils/pagination/pagination';
import { User } from '../../users/entities/user.entity';
import { BlogSubscriptionCommand } from '../use-case/blog.subscription.use-case';
import { BlogUnsubscriptionCommand } from '../use-case/blog.unsubscription.use-case';
import { GetAllBlogsCommand } from '../use-case/get.all.blogs.use-case';
import { GetAllPostsByBlogCommand } from '../use-case/get.all.posts.by.blog.use-case';
import { GetBlogByIdCommand } from '../use-case/get.blog.by.id.use-case';

@Controller('blogs')
export class BlogsPublicController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  @UseGuards(UserIdFromToken)
  getAllBlogs(
    @Query() pagination: BlogQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(new GetAllBlogsCommand(userId, pagination));
  }

  @Get(':blogId')
  @UseGuards(UserIdFromToken)
  async getBlogById(
    @Param('blogId') blogId: string,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(new GetBlogByIdCommand(userId, blogId));
  }

  @Get('/:blogId/posts')
  @UseGuards(UserIdFromToken)
  getPostsByBlog(
    @Param('blogId') blogId: string,
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return this.commandBus.execute(
      new GetAllPostsByBlogCommand(userId, blogId, pagination),
    );
  }

  @Post('/:blogId/subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  blogSubscription(@ReqUser() user: User, @Param('blogId') blogId: string) {
    return this.commandBus.execute(
      new BlogSubscriptionCommand(user.id, blogId),
    );
  }

  @Delete('/:blogId/subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  blogUnsubscription(@ReqUser() user: User, @Param('blogId') blogId: string) {
    return this.commandBus.execute(
      new BlogUnsubscriptionCommand(user.id, blogId),
    );
  }
}
