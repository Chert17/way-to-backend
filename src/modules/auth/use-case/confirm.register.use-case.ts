import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../../users/repositories/users.repo';

export class ConfirmRegisterUserCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmRegisterUserCommand)
export class ConfirmRegisterUseCase
  implements ICommandHandler<ConfirmRegisterUserCommand>
{
  constructor(private usersRepo: UsersRepo) {}

  async execute({ code }: ConfirmRegisterUserCommand) {
    return this.usersRepo.setConfirmRegister(code);
  }
}
