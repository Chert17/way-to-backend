import { useContainer } from 'class-validator';

import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { HttpExceptionFilter } from '../../infra/exception-filters/http.exception.filter';
import { GlobalValidationPipe } from '../../infra/pipe/global.validation.pipe';

export const initApp = (app: INestApplication): INestApplication => {
  app.enableCors();

  app.useGlobalPipes(GlobalValidationPipe);

  app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
};
