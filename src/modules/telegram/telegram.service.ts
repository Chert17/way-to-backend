import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { NEW_POST_TELEGRAM_NOTIFICATION_EVENT } from '../../utils/events/events';
import { SETTINGS } from '../../utils/settings';
import { UsersRepo } from '../users/repositories/users.repo';

const { SERVEO_URL, TELEGRAM_BOT_TOKEN } = SETTINGS;

@Injectable()
export class TelegramService {
  private _telegramUrl: string;
  private _telegramBotToken: string;
  private _serveoUrl: string;

  constructor(
    private configService: ConfigService,
    private usersRepo: UsersRepo,
  ) {
    this._telegramBotToken = this.configService.get(TELEGRAM_BOT_TOKEN);
    this._serveoUrl = this.configService.get(SERVEO_URL);
    this._telegramUrl = `https://api.telegram.org/bot${this._telegramBotToken}`;
  }

  async setWebhook() {
    const webhookUrl = `${this._serveoUrl}/api/integrations/telegram/webhook`;

    try {
      await fetch(`${this._telegramUrl}/setWebhook?url=${webhookUrl}`, {
        method: 'POST',
      });
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent(NEW_POST_TELEGRAM_NOTIFICATION_EVENT)
  async newPostByBlogNotification(userId: string, blogId: string) {
    const result = await this.usersRepo.getUsersSubscribedBlog(userId, blogId);

    for (const item of result) {
      try {
        const text = `New post published for blog ${item.title.toUpperCase()}`;

        await fetch(
          `${this._telegramUrl}/sendMessage?chat_id=${item.chat_id}&text=${text}`,
          { method: 'POST' },
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
}
