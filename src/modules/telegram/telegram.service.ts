import https, { RequestOptions } from 'https';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SETTINGS } from '../../utils/settings';

const { SERVEO_URL, TELEGRAM_BOT_TOKEN } = SETTINGS;

@Injectable()
export class TelegramService {
  private _baseAppUrl: string;
  private _telegramBotToken: string;

  constructor(private configService: ConfigService) {
    this._baseAppUrl = this.configService.get(SERVEO_URL);
    this._telegramBotToken = this.configService.get(TELEGRAM_BOT_TOKEN);
  }

  async setWebhook() {
    const webhookUrl = `${this._baseAppUrl}/api/integrations/telegram/webhook`;

    const requestOptions: RequestOptions = {
      hostname: 'api.telegram.org',
      path: `/bot${this._telegramBotToken}/setWebhook?url=${webhookUrl}`,
      method: 'POST',
    };

    const req = https.request(requestOptions, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('TELEGRAM HOOK', data);
      });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.end();
  }
}
