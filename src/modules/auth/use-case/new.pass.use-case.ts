import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { generateHash } from '../../../helpers/generate.hash';
import { UsersRepo } from '../../users/repositories/users.repo';
import { NewPassServiceDto } from '../dto/input/new.password.dto';

export class NewPassCommand {
  constructor(public dto: NewPassServiceDto) {}
}

@CommandHandler(NewPassCommand)
export class NewPassUseCase implements ICommandHandler<NewPassCommand> {
  constructor(private usersRepo: UsersRepo) {}

  async execute({ dto }: NewPassCommand) {
    const { newPassword, recoveryCode } = dto;

    console.log('USE-CASE', recoveryCode);

    const { user_id } = await this.usersRepo.getRecoveryPassInfoByCode(
      recoveryCode,
    );

    const passwordHash = await generateHash(newPassword);

    return await this.usersRepo.setNewPass(user_id, passwordHash);
  }
}
