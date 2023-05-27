import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { SETTINGS } from '../../utils/settings';

const { TEST_EMAIL, TEST_PASS } = SETTINGS;

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: TEST_EMAIL,
          pass: TEST_PASS,
        },
      },
    }),
  ],
})
export class EmailModule {}
