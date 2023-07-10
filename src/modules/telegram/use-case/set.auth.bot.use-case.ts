import { isUUID } from 'class-validator';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';
import { TelegramUpdateMessage } from '../dto/update.message.dto';

export class SetAuthTelegramBotCommand {
  constructor(public payload: TelegramUpdateMessage) {}
}

@CommandHandler(SetAuthTelegramBotCommand)
export class SetAuthTelegramBotUseCase
  implements ICommandHandler<SetAuthTelegramBotCommand>
{
  constructor(private usersRepo: UsersRepo) {}

  async execute({ payload }: SetAuthTelegramBotCommand) {
    const {
      message: {
        from: { id },
        text,
      },
    } = payload;

    const code = text.split('=')[1];

    const telegramInfo = await this.usersRepo.getTelegramConfirmInfoByCode(
      code,
    );

    if (!telegramInfo) return; //? maybe return throw badRequest

    if (telegramInfo.is_confirmed) return;

    if (!code || !isUUID(code)) return;

    if (telegramInfo.confirm_code !== code) return;

    return this.usersRepo.setTelegramConfirmInfo(id);
  }
}
