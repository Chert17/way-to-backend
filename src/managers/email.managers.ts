import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

import { emailAdapter } from '../adapters/email.adapter';

const registerSubject = 'HW-07';

export const emailManager = {
  sendEmailMessage: async (
    email: string,
    code: string
  ): Promise<SentMessageInfo | null> => {
    const registerMessage = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href="https://somesite.com/confirm-email?code=${code}">complete registration</a></p>`;

    return await emailAdapter.sendEmail(
      email,
      registerSubject,
      registerMessage
    );
  },
};
