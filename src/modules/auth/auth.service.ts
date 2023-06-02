import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { addMinutesToCurrentDate } from '../../helpers/add.minutes.current.date';
import { DevicesService } from '../devices/devices.service';
import { EmailService } from '../email/email.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { LoginServiceDto } from './dto/input/login.dto';
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
    private devicesService: DevicesService,
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

  async login(dto: LoginServiceDto): Promise<null | JwtTokensDto> {
    const { ip, loginOrEmail, password, userAgent } = dto;

    const user = await this.usersRepo.getUserByEmailOrLogin(loginOrEmail);

    if (!user) return null;

    const pass = await compare(password, user.accountData.passwordHash);

    if (!pass) return null;

    if (!user.emailInfo.isConfirmed) return null; // if user is not confirmed unauth

    const tokens = this.jwtService.createJWT(String(user._id));

    const lastActiveDate = this.jwtService.getTokenIat(tokens.refreshToken);

    const deviceId = randomUUID();

    await this.devicesService.createNewDevice({
      userId: user._id.toString(),
      deviceId,
      deviceName: userAgent,
      ip,
      lastActiveDate,
    });

    return tokens;
  }
}
