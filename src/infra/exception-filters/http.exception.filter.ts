import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 401) return res.sendStatus(401);

    if (status === 404) return res.sendStatus(404);

    const errRes: any = exception.getResponse();

    res.status(status).json({
      errorsMessages: errRes.message,
    });
  }
}
