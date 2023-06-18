import { randomUUID } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { addMinutesToCurrentDate } from '../../../helpers/add.minutes.current.date';
import { EmailService } from '../../email/email.service';
import { UsersRepo } from '../../users/repositories/users.repo';

export class RecoveryPassCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoveryPassCommand)
export class RecoveryPassUseCase
  implements ICommandHandler<RecoveryPassCommand>
{
  constructor(
    private usersRepo: UsersRepo,
    private emailService: EmailService,
  ) {}

  async execute({ email }: RecoveryPassCommand) {
    const user = await this.usersRepo.checkUserByEmail(email);

    if (!user) return;

    const recoveryCode = randomUUID();
    const expDate = addMinutesToCurrentDate(2); // add 2 minutes to expirationDate

    await this.usersRepo.createRecoveryPassInfo({
      userId: user.id,
      recoveryCode,
      expDate,
    });

    return this.emailService.sendPasswordRecoveryEmail(email, recoveryCode);
  }
}
