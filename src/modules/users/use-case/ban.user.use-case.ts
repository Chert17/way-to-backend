import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BanUserServiceDto } from '../dto/ban.user.dto';
import { UsersRepo } from '../repositories/users.repo';

export class BanUserCommand {
  constructor(public dto: BanUserServiceDto) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(private usersRepo: UsersRepo) {}

  async execute({ dto }: BanUserCommand) {
    const user = await this.usersRepo.checkUserById(dto.userId);

    if (!user) throw new NotFoundException();

    return this.usersRepo.banUser({
      userId: dto.userId,
      isBanned: dto.isBanned,
      banReason: dto.banReason,
      banDate: new Date().toISOString(),
    });
  }
}
