import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserServiceDto } from '../dto/create-user.dto';
import { UsersQueryRepo } from '../repositories/users.query.repo';
import { UsersService } from '../users.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserServiceDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userdService: UsersService,
    private usersQueryRepo: UsersQueryRepo,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const { userId } = await this.userdService.createUser(dto);

    return this.usersQueryRepo.getUserById(userId);
  }
}
