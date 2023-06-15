import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { generateHash } from '../../../helpers/generate.hash';
import { CreateUserServiceDto } from '../dto/create-user.dto';
import { UsersQueryRepo } from '../repositories/users.query.repo';
import { UsersRepo } from '../repositories/users.repo';

export class CreateUserCommand {
  constructor(public dto: CreateUserServiceDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepo: UsersRepo,
    private usersQueryRepo: UsersQueryRepo,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const { userId } = await this.usersRepo.createUser({
      ...dto,
      createdAt: new Date().toISOString(),
      pass_hash: await generateHash(dto.password),
    });

    return this.usersQueryRepo.getUserById(userId);
  }
}
