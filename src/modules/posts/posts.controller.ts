import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReqUser } from '../../infra/decorators/param/req.user.decorator';
import { UserId } from '../../infra/decorators/param/req.userId.decorator';
import { BasicAuthGuard } from '../../infra/guards/auth/basic.auth.guard';
import { JwtAuthGuard } from '../../infra/guards/auth/jwt.auth.guard';
import { UserIdFromToken } from '../../infra/guards/auth/userId.from.token.guard';
import { LikeStatusDto } from '../../types/like.info.interface';
import { ReqUserId } from '../../types/req.user.interface';
import {
  CommentQueryPagination,
  PostQueryPagination,
} from '../../utils/pagination/pagination';
import { createCommentDto } from '../comments/dto/input/create.comment.dto';
import { CommentsQueryRepo } from '../comments/repositories/comments.query.repo';
import { UserViewDto } from '../users/dto/view/user.view.dto';
import { createPostDto } from './dto/input/create.post.dto';
import { updatePostDto } from './dto/input/update.post.dto';
import { PostsService } from './posts.service';
import { PostsQueryRepo } from './repositories/posts.query.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepo: PostsQueryRepo,
    private postsService: PostsService,
    private commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get()
  @UseGuards(UserIdFromToken)
  async getAll(
    @Query() pagination: PostQueryPagination,
    @UserId() userId: ReqUserId,
  ) {
    return await this.postsQueryRepo.getAllPosts(pagination, userId);
  }

  @Get('/:id')
  @UseGuards(UserIdFromToken)
  async getPostById(@Param() postId: string, @UserId() userId: ReqUserId) {
    const result = await this.postsQueryRepo.getPostById(postId, userId);

    if (!result) throw new NotFoundException(); // If specified post doesn't exists

    return result;
  }

  @Get('/:postId/comments')
  @UseGuards(UserIdFromToken)
  async getCommnetsByPost(
    @Param('postId') postId: string,
    @Query() pagination: CommentQueryPagination,
    @UserId() userId: ReqUserId,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId, null);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return await this.commentsQueryRepo.getAllCommentsByPostId(
      postId,
      pagination,
      userId,
    );
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() postDto: createPostDto) {
    const result = await this.postsService.createPost(postDto);

    if (!result) throw new NotFoundException();

    const post = await this.postsQueryRepo.getPostById(
      result._id.toString(),
      null,
    );

    return post;
  }

  @Post('/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentByPost(
    @Param('postId') postId: string,
    @Body() dto: createCommentDto,
    @ReqUser() user: UserViewDto,
  ) {
    const result = await this.postsService.createCommentByPost({
      content: dto.content,
      postId,
      userId: user.id,
      userLogin: user.login,
    });

    if (!result) throw new NotFoundException(); // If specified post doesn't exists

    return await this.commentsQueryRepo.getCommentById(
      result._id.toString(),
      user.id,
    );
  }

  @Put('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePost(@Param() postId: string, @Body() dto: updatePostDto) {
    const result = await this.postsService.updatePost(dto, postId);

    if (!result) throw new NotFoundException();

    return;
  }

  @Put('/:postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updatePostLikeInfo(
    @Param('postId') postId: string,
    @Body() dto: LikeStatusDto,
    @ReqUser() user: UserViewDto,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId, user.id);

    if (!post) throw new NotFoundException(); // If specified post doesn't exists

    return await this.postsService.updateLikeStatus({
      postId,
      likeStatus: dto.likeStatus,
      userId: user.id,
      userLogin: user.login,
    });
  }

  @Delete('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlog(@Param() postId: string) {
    const result = await this.postsService.deletePost(postId);

    if (!result) throw new NotFoundException();

    return;
  }
}
