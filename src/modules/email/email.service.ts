import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private _subject: 'WAY TO BACKEND';
  constructor(private mailerService: MailerService) {}

  async sendRegistrationEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: this._subject,
      template: './templates/register.hbs',
      context: {
        code,
      },
    });
  }
}
