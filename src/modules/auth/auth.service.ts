import { Injectable } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { RegisterDto } from './dto/input/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
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
}
