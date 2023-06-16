import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BanUserServiceDto } from '../dto/ban.user.dto';
import { UsersRepo } from '../repositories/users.repo';
import { UsersService } from '../users.service';

export class BanUserCommand {
  constructor(public dto: BanUserServiceDto) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private usersRepo: UsersRepo,
    private usersService: UsersService,
  ) {}

  async execute({ dto }: BanUserCommand) {
    const { id } = await this.usersService.checkUserById(dto.userId);

    return this.usersRepo.banUser({
      userId: id,
      isBanned: dto.isBanned,
      banReason: dto.banReason,
      banDate: new Date().toISOString(),
    });
  }
}
