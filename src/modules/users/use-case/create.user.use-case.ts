import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserDto } from '../dto/create-user.dto';
import { UsersQueryRepo } from '../repositories/users.query.repo';
import { CreateUserFormat } from '../types/user.types';
import { UsersService } from '../users.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userdService: UsersService,
    private usersQueryRepo: UsersQueryRepo,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const { userId } = await this.userdService.createUser({
      ...dto,
      format: CreateUserFormat.SA,
    });

    return this.usersQueryRepo.getUserById(userId);
  }
}
