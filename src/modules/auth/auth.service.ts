import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { addMinutesToCurrentDate } from '../../helpers/add.minutes.current.date';
import { EmailService } from '../email/email.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { RegisterDto } from './dto/input/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private usersRepo: UsersRepo,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const user = await this.usersService.registerUser(dto);
    const {
      accountData: { email },
      emailInfo: { confirmationCode },
    } = user;

    await this.emailService.sendRegistrationEmail(email, confirmationCode);
    return;
  }

  async confirmRegister(dto: ConfirmRegisterDto): Promise<void> {
    await this.usersService.updateConfirmEmailStatus(dto.code);
    return;
  }

  async resendingEmail(dto: EmailResendingDto): Promise<void> {
    const { email } = dto;
    const newCode = randomUUID(); // new confirmationCode
    const newExpDate = addMinutesToCurrentDate(2); // add 2 minutes to new expirationDate

    await this.usersRepo.updateConfirmCodeByEmail(email, newCode, newExpDate);

    await this.emailService.sendRegistrationEmail(email, newCode);
    return;
  }
}
