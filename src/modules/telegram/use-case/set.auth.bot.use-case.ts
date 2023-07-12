import { isUUID } from 'class-validator';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';

export class SetAuthTelegramBotCommand {
  constructor(public payload: any) {}
}

@CommandHandler(SetAuthTelegramBotCommand)
export class SetAuthTelegramBotUseCase
  implements ICommandHandler<SetAuthTelegramBotCommand>
{
  constructor(private usersRepo: UsersRepo) {}

  async execute({ payload }: SetAuthTelegramBotCommand) {
    const pay: any = {};

    pay['id'] = payload?.message?.from?.id ?? payload?.my_chat_member?.from?.id;
    pay['text'] = payload?.message?.text ?? payload?.my_chat_member?.text;
    pay['chat'] = payload?.message?.chat ?? payload?.my_chat_member?.chat;

    if (pay.text && pay.text.startsWith('/start')) {
      const code = pay.text.split('=')[1];

      const telegramInfo = await this.usersRepo.getTelegramConfirmInfoByCode(
        code,
      );

      if (!telegramInfo) return; //? maybe return throw badRequest

      if (telegramInfo.is_confirmed) return;

      if (!code || !isUUID(code)) return;

      if (telegramInfo.confirm_code !== code) return;

      return this.usersRepo.setTelegramConfirmInfo(code, pay.id, pay.chat.id);
    }
  }
}
