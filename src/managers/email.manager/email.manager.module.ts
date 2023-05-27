import { Module } from '@nestjs/common';

import { EmailService } from '../../adapters/email/email.service';
import { EmailManagerService } from './email.manager.service';

@Module({
  providers: [EmailManagerService, EmailService],
})
export class EmailManagerModule {}
