import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { addMinutesToCurrentDate } from '../../helpers/add.minutes.current.date';
import { EmailService } from '../email/email.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { LoginDto } from './dto/input/login.dto';
import { RegisterDto } from './dto/input/register.dto';
import { JwtTokensDto } from './dto/view/tokens.view.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
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

  async login(dto: LoginDto): Promise<JwtTokensDto | null> {
    const user = await this.usersRepo.checkUserByLoginOrEmail(dto.loginOrEmail);

    if (!user) return null;

    const pass = await compare(dto.password, user.passwordHash);

    if (!pass) return null;

    return this.jwtService.createJWT(String(user.userId));
  }
}
