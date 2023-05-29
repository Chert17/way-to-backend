import { INestApplication } from '@nestjs/common';

import { HttpExceptionFilter } from '../../infra/exception-filters/http.exception.filter';
import { GlobalValidationPipe } from '../../infra/pipe/global.validation.pipe';

export const initApp = (app: INestApplication): INestApplication => {
  app.enableCors();

  app.useGlobalPipes(GlobalValidationPipe);

  app.useGlobalFilters(new HttpExceptionFilter());

  return app;
};
