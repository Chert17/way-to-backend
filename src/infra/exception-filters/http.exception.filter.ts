import { log } from 'console';
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

    if (status === 400) {
      const errRes: any = exception.getResponse();

      return res.status(status).json({
        errorsMessages: errRes.message,
      });
    } else {
      if (status === 500) {
        log(exception.getResponse());
      }
      return res.sendStatus(status);
    }
  }
}
