import { Response } from 'express';

import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import { CommentInputModel, CommentViewModel } from '../models/comments.models';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { PostQueryRepo } from '../repositories/posts/post.query.repo';
import { commentService } from '../service/comment.service';
import { PostService } from '../service/post.service';
import { IWithPagination } from '../types/pagination.interface';
import {
  PaginationQueryParams,
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
  TypeRequestParamsAndQuery,
  TypeRequestQuery,
} from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export class PostController {
  constructor(
    protected postQueryRepo: PostQueryRepo,
    protected postService: PostService
  ) {}

  async getAllPosts(
    req: TypeRequestQuery<PaginationQueryParams>,
    res: Response<IWithPagination<PostViewModel>>
  ) {
    const pagination = paginationQueryParamsValidation(req.query);

    const posts = await this.postQueryRepo.getAllPosts(pagination);

    return res.status(STATUS_CODE.OK).json(posts);
  }

  async getPostById(
    req: TypeRequestParams<{ id: string }>,
    res: Response<PostViewModel>
  ) {
    const post = await this.postQueryRepo.getPostById(req.params.id);

    if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not fount post

    return res.status(STATUS_CODE.OK).json(post);
  }

  async getAllCommentsByOnePost(
    req: TypeRequestParamsAndQuery<{ postId: string }, PaginationQueryParams>,
    res: Response<IWithPagination<CommentViewModel>>
  ) {
    const { postId } = req.params;

    const post = await this.postQueryRepo.getPostById(postId);

    if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found post by postId from req.params

    const pagination = paginationQueryParamsValidation(req.query);

    const comments = await commentQueryRepo.getAllComments(post.id, pagination);

    return res.status(STATUS_CODE.OK).json(comments);
  }

  async createPost(
    req: TypeRequestBody<PostInputModel>,
    res: Response<PostViewModel>
  ) {
    const { blogId, content, shortDescription, title } = req.body;

    const post = await this.postService.createPost({
      blogId,
      content,
      shortDescription,
      title,
    });

    if (!post) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild create post

    return res.status(STATUS_CODE.CREATED).json(post);
  }

  async createCommentByPostId(
    req: TypeRequestParamsAndBody<{ postId: string }, CommentInputModel>,
    res: Response<CommentViewModel>
  ) {
    const { content } = req.body;

    const post = await this.postQueryRepo.getPostById(req.params.postId);

    if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found post by postId from req.params.postId

    const comment = await commentService.createComment(
      content,
      post.id,
      req.userId!
    );

    if (!comment) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild create comment

    return res.status(STATUS_CODE.CREATED).json(comment);
  }

  async updatePost(
    req: TypeRequestParamsAndBody<{ id: string }, PostInputModel>,
    res: Response
  ) {
    const postId = await this.postQueryRepo.getPostById(req.params.id);

    if (!postId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found post

    const result = await this.postService.updatePost(postId.id, req.body);

    if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild update post

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async deletePost(req: TypeRequestParams<{ id: string }>, res: Response) {
    const postId = await this.postQueryRepo.getPostById(req.params.id);

    if (!postId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found post

    const result = await this.postService.deletePost(postId.id);

    if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild delete post

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }
}
