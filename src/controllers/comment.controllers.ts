import { Response } from 'express';

import { CommentInputModel, CommentViewModel } from '../models/comments.models';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { commentService } from '../service/comment.service';
import {
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const getCommentByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<CommentViewModel>
) => {
  const comment = await commentQueryRepo.getCommentById(req.params.id);

  if (!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found comment by id from req.params.id

  return res.status(STATUS_CODE.OK).json(comment);
};

export const updateCommentController = async (
  req: TypeRequestParamsAndBody<{ commentId: string }, CommentInputModel>,
  res: Response
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const result = await commentService.updateComment(commentId, content);

  if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild update comment

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const deleteCommentController = async (
  req: TypeRequestParams<{ commentId: string }>,
  res: Response
) => {
  const result = await commentService.deleteComment(req.params.commentId);

  if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild delete comment

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};
