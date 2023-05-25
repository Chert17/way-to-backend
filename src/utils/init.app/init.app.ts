import { INestApplication, ValidationPipe } from '@nestjs/common';

export const initApp = (app: INestApplication) => {
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );
};
