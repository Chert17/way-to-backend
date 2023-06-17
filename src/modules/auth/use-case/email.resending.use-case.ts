import { randomUUID } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { addMinutesToCurrentDate } from '../../../helpers/add.minutes.current.date';
import { EmailService } from '../../email/email.service';
import { UsersRepo } from '../../users/repositories/users.repo';

export class EmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase
  implements ICommandHandler<EmailResendingCommand>
{
  constructor(
    private usersRepo: UsersRepo,
    private emailService: EmailService,
  ) {}

  async execute({ email }: EmailResendingCommand) {
    const newCode = randomUUID(); // new confirmationCode
    const newExpDate = addMinutesToCurrentDate(2); // add 2 minutes to new expirationDate

    await this.usersRepo.updateConfirmEmailInfo({
      email,
      newCode,
      newExpDate,
    });

    return this.emailService.sendRegistrationEmail(email, newCode);
  }
}
