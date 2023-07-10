import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { TelegramService } from './modules/telegram/telegram.service';
import { initApp } from './utils/init.app/init.app';
import { SETTINGS } from './utils/settings';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);

  const app = initApp(rawApp);

  await app.listen(SETTINGS.PORT, () => {
    console.log(`App started at: ${SETTINGS.PORT} port`);
  });

  const telegramService = await app.resolve(TelegramService);

  await telegramService.setWebhook();
}

bootstrap();
