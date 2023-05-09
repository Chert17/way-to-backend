import { createTransport } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

import { SETTINGS } from '../utils/settings';

const { TEST_EMAIL, TEST_PASS } = SETTINGS;

export const emailAdapter = {
  sendEmail: async (
    email: string,
    subject: string,
    message: string
  ): Promise<SentMessageInfo | null> => {
    try {
      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: TEST_EMAIL,
          pass: TEST_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `BACK HW-07 <${TEST_EMAIL}>`,
        to: email,
        subject: subject,
        html: message,
      });

      if (info.rejected.length > 0) return null; // message not sent

      return info;
    } catch (error) {
      return null;
    }
  },
};
