import { Response } from 'express';

import { CommentInputModel, CommentViewModel } from '../models/comments.models';
import { LikesInputModel } from '../models/likes.models';
import { CommentQueryRepo } from '../repositories/comments/comment.query.repo';
import { CommentService } from '../service/comment.service';
import {
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export class CommentController {
  constructor(
    protected commentQueryRepo: CommentQueryRepo,
    protected commentService: CommentService
  ) {}

  async getCommentById(
    req: TypeRequestParams<{ id: string }>,
    res: Response<CommentViewModel>
  ) {
    const comment = await this.commentQueryRepo.getCommentById(req.params.id);

    if (!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found comment by id from req.params.id

    return res.status(STATUS_CODE.OK).json(comment);
  }

  async updateComment(
    req: TypeRequestParamsAndBody<{ commentId: string }, CommentInputModel>,
    res: Response
  ) {
    const { commentId } = req.params;
    const { content } = req.body;

    const result = await this.commentService.updateComment(commentId, content);

    if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild update comment

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async updateCommentLikeStatus(
    req: TypeRequestParamsAndBody<{ commentId: string }, LikesInputModel>,
    res: Response
  ) {
    const { commentId } = req.params;
    const { likeStatus } = req.body;

    const comment = await this.commentQueryRepo.getCommentById(commentId);

    if (!comment) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // not found comment by req commentId

    await this.commentService.updateCommentLikeStatus(
      comment.id,
      likeStatus,
      req.userId! // because I'm check in jwtAuthMiddleware
    );

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async deleteComment(
    req: TypeRequestParams<{ commentId: string }>,
    res: Response
  ) {
    const result = await this.commentService.deleteComment(
      req.params.commentId
    );

    if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild delete comment

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }
}
