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

import { BasicAuthGuard } from '../../infra/guards/auth/basic.auth.guard';
import {
  CommentQueryPagination,
  PostQueryPagination,
} from '../../utils/pagination/pagination';
import { CreateCommentDto } from '../comments/dto/input/create.comment.dto';
import { CommentsQueryRepo } from '../comments/repositories/comments.query.repo';
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
  async getAll(@Query() pagination: PostQueryPagination) {
    return await this.postsQueryRepo.getAllPosts(pagination);
  }

  @Get('/:id')
  async getPostById(@Param() postId: string) {
    const result = await this.postsQueryRepo.getPostById(postId);

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get('/:postId/comments')
  async getCommnetsByPost(
    @Param('postId') postId: string,
    @Query() pagination: CommentQueryPagination,
  ) {
    const post = await this.postsQueryRepo.getPostById(postId);

    if (!post) throw new NotFoundException();

    return await this.commentsQueryRepo.getAllCommentsByPostId(
      postId,
      pagination,
    );
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() postDto: createPostDto) {
    const result = await this.postsService.createPost(postDto);

    if (!result) throw new NotFoundException();

    const post = await this.postsQueryRepo.getPostById(result._id.toString());

    return post;
  }

  @Post('/:postId/comments')
  async createCommentByPost(
    @Param('postId') postId: string,
    @Body() dto: Omit<CreateCommentDto, 'postId'>,
  ) {
    const result = await this.postsService.createCommentByPost({
      ...dto,
      postId,
    });

    if (!result) throw new NotFoundException();

    return await this.commentsQueryRepo.getCommentById(result._id.toString());
  }

  @Put('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePost(
    @Param() postId: string,
    @Body() postDto: Omit<updatePostDto, 'postId'>,
  ) {
    const result = await this.postsService.updatePost({ ...postDto, postId });

    if (!result) throw new NotFoundException();

    return;
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
