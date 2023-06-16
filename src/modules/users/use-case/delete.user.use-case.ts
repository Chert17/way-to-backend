import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersRepo } from '../repositories/users.repo';
import { UsersService } from '../users.service';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private usersRepo: UsersRepo,
    private usersService: UsersService,
  ) {}

  async execute({ userId }: DeleteUserCommand) {
    const { id } = await this.usersService.checkUserById(userId);

    return this.usersRepo.deleteUser(id);
  }
}
