import { randomUUID } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { addMinutesToCurrentDate } from '../../../helpers/add.minutes.current.date';
import { EmailService } from '../../email/email.service';
import { CreateUserServiceDto } from '../../users/dto/create-user.dto';
import { UsersRepo } from '../../users/repositories/users.repo';
import { UsersService } from '../../users/users.service';

export class RegisterUserCommand {
  constructor(public dto: CreateUserServiceDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private usersService: UsersService,
    private usersRepo: UsersRepo,
    private emailService: EmailService,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
    const { userId } = await this.usersService.createUser(dto);

    const code = randomUUID();

    await this.usersRepo.registerUser({
      userId,
      confirmCode: code,
      isConfirmed: false,
      exprDate: addMinutesToCurrentDate(2),
    });

    await this.emailService.sendRegistrationEmail(dto.email, code);

    return;
  }
}
