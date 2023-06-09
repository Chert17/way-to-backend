import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReqUser } from '../../infra/decorators/param/req.user.decorator';
import { UserId } from '../../infra/decorators/param/req.userId.decorator';
import { JwtAuthGuard } from '../../infra/guards/auth/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/auth/userId.from.token.guard';
import { DbType } from '../../types/db.interface';
import { LikeStatusDto } from '../../types/like.info.interface';
import { ReqUserIdType } from '../../types/req.user.interface';
import {
  CommentQueryPagination,
  PostQueryPagination,
} from '../../utils/pagination/pagination';
import { BlogsRepo } from '../blogs/repositories/blogs.repo';
import { createCommentDto } from '../comments/dto/input/create.comment.dto';
import { CommentsQueryRepo } from '../comments/repositories/comments.query.repo';
import { User } from '../users/schemas/users.schema';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/posts.query.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepo: PostsQueryRepo,
    private postsService: PostsService,
    private commentsQueryRepo: CommentsQueryRepo,
    private blogsRepo: BlogsRepo,
  ) {}

  @Get()
  @UseGuards(UserIdFromToken)
  async getAll(
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    return await this.postsQueryRepo.getAllPosts(pagination, userId);
  }

  @Get('/:id')
  @UseGuards(UserIdFromToken)
  async getPostById(@Param() postId: string, @UserId() userId: ReqUserIdType) {
    const result = await this.postsQueryRepo.getPostById(postId, userId);

    if (!result) throw new NotFoundException(); // If specified post doesn't exists

    return result;
  }

  @Get('/:postId/comments')
  @UseGuards(UserIdFromToken)
  async getCommnetsByPost(
    @Param('postId') postId: string,
    @Query() pagination: CommentQueryPagination,
    @UserId() userId: ReqUserIdType,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return await this.commentsQueryRepo.getAllCommentsByPostId(
      postId,
      pagination,
      userId,
    );
  }

  @Post('/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentByPost(
    @Param('postId') postId: string,
    @Body() dto: createCommentDto,
    @ReqUser() user: DbType<User>,
  ) {
    const userId = user._id.toString();

    const isBanUser = await this.blogsRepo.isBanUserByBlog(userId, postId);

    if (isBanUser) throw new ForbiddenException();

    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException();

    const commentId = await this.postsService.createCommentByPost({
      content: dto.content,
      postId,
      userId,
      userLogin: user.accountData.login,
    });

    return await this.commentsQueryRepo.getCommentById(
      commentId.toString(),
      userId,
    );
  }

  @Put('/:postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeInfo(
    @Param('postId') postId: string,
    @Body() dto: LikeStatusDto,
    @ReqUser() user: DbType<User>,
  ) {
    const userId = user._id.toString();

    const post = await this.postsQueryRepo.getPostById(postId, userId);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return await this.postsService.updateLikeStatus({
      postId,
      likeStatus: dto.likeStatus,
      userId,
      userLogin: user.accountData.login,
    });
  }
}
