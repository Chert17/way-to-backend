import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

import { Inject, Injectable } from '@nestjs/common';

import { EmailService } from '../../adapters/email/email.service';

const subject = 'WAY TO BACKEND';

@Injectable()
export class EmailManagerService {
  constructor(@Inject(EmailService) private emailService: EmailService) {}

  async sendConfirmEmailMessage(
    email: string,
    code: string,
  ): Promise<SentMessageInfo | null> {
    const message = `<h1>Thank for your registration</h1>
   <p>To finish registration please follow the link below:
      <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a>
   </p>`;

    return await this.emailService.sendEmail({ email, subject, message });
  }

  async sendRecoveryPasswordMessage(
    email: string,
    code: string,
  ): Promise<SentMessageInfo | null> {
    const message = `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
         <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`;

    return await this.emailService.sendEmail({ email, subject, message });
  }
}
