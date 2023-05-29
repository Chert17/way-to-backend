import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/input/register.dto';
import { AuthRepo } from './repositories/auth.repo';
import { ConfirmEmail } from './schemas/confirm.email.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private authRepo: AuthRepo,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);

    const code = await this._createConfirmEmailCode(user._id.toString());

    await this.emailService.sendRegistrationEmail(user.email, code);
    return;
  }

  private async _createConfirmEmailCode(userId: string): Promise<string> {
    const emailConfirmation: ConfirmEmail = {
      userId,
      confirmationCode: randomUUID(),
      expirationDate: new Date(new Date().getTime() + 60000 * 2), // add 2 min to expirationDate
      isConfirm: false,
    };

    await this.authRepo.userConfirmEmail(emailConfirmation);

    return emailConfirmation.confirmationCode;
  }
}
