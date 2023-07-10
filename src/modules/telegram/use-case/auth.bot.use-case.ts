import { randomUUID } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';

export class AuthTelegramBotCommand {
  constructor(public userId: string) {}
}

@CommandHandler(AuthTelegramBotCommand)
export class AuthTelegramBotUseCase
  implements ICommandHandler<AuthTelegramBotCommand>
{
  constructor(private usersRepo: UsersRepo) {}

  async execute({ userId }: AuthTelegramBotCommand) {
    const TELEGRAM_BOT_NAME = 'social-hw';
    const code = randomUUID();

    await this.usersRepo.addTelegramConfirmCode(userId, code);

    return { link: `https://t.me/${TELEGRAM_BOT_NAME}?code=${code}` };
  }
}
