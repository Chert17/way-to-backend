import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private _subject: 'WAY TO BACKEND';
  constructor(private mailerService: MailerService) {}

  async sendRegistrationEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: this._subject,
        template: './register',
        context: {
          code,
        },
      });

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async sendPasswordRecoveryEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: this._subject,
        template: './password-recovery',
        context: {
          code,
        },
      });

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
