import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { initApp } from './utils/init.app/init.app';
import { SETTINGS } from './utils/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initApp(app);

  await app.listen(SETTINGS.PORT);
}
bootstrap();
