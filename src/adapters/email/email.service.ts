import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { SETTINGS } from '../../utils/settings';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(dto: EmailDto): Promise<SentMessageInfo | null> {
    const { email, message, subject } = dto;

    try {
      const info = await this.mailerService.sendMail({
        to: email,
        from: `WAY TO BACKEND <${SETTINGS.TEST_EMAIL}>`,
        subject,
        html: message,
      });

      if (info.rejected.length > 0) return null; // message not sent

      return info;
    } catch (error) {
      return null;
    }
  }
}
