import { Response, NextFunction } from 'express';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { TypeRequestParams } from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const checkUserCanWorkWithCommentMiddleware = async (
  req: TypeRequestParams<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentQueryRepo.getCommentById(req.params.commentId);

  if (!comment) {
    res.sendStatus(STATUS_CODE.NOT_FOUND);
    return;
  }

  if (req.userId !== comment.commentatorInfo.userId) {
    res.sendStatus(STATUS_CODE.FORBIDDEN);
    return;
  }

  next();
};
