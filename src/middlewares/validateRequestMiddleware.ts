import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { STATUS_CODE } from '../utils/status.code';

export const validateRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //!
  //? type Pick<FieldValidationError, 'msg' | 'path'> //?
  //!

  const ErrorFormatter = ({ msg, path }: any) => ({
    message: msg,
    field: path,
  });

  const errors = validationResult(req).formatWith(ErrorFormatter);

  if (!errors.isEmpty()) {
    res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ errorsMessages: errors.array({ onlyFirstError: true }) });
    return;
  }

  next();
};
