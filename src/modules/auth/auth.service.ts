import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { addMinutesToCurrentDate } from '../../helpers/add.minutes.current.date';
import { ReqUserType } from '../../types/req.user.interface';
import { DevicesService } from '../devices/devices.service';
import { DevicesRepo } from '../devices/repositories/devices.repo';
import { EmailService } from '../email/email.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { LoginServiceDto } from './dto/input/login.dto';
import { newPasswordDto } from './dto/input/new.password.dto';
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
    private devicesRepo: DevicesRepo,
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

    const deviceId = randomUUID();

    const tokens = this.jwtService.createJWT(String(user._id), deviceId);

    const lastActiveDate = this.jwtService.getTokenIat(tokens.refreshToken);

    await this.devicesService.createNewDevice({
      userId: user._id.toString(),
      deviceId,
      deviceName: userAgent,
      ip,
      lastActiveDate,
    });

    return tokens;
  }

  async refreshToken(refreshPayload: ReqUserType, ip: string) {
    const { userId, deviceId, iat } = refreshPayload;

    const device = await this.devicesRepo.getDeviceById(deviceId);
    if (!device) return null;
    if (device.userId !== userId) return null;
    if (device.lastActiveDate !== new Date(iat * 1000).toISOString())
      return null;

    const tokens = this.jwtService.createJWT(userId, deviceId);

    const lastActiveDate = this.jwtService.getTokenIat(tokens.refreshToken);

    await this.devicesService.updateDevice({
      userId,
      deviceId,
      ip,
      lastActiveDate,
    });

    return tokens;
  }

  async logout(dto: ReqUserType) {
    const device = await this.devicesRepo.getDeviceById(dto.deviceId);
    if (!device) return null;
    if (device.userId !== dto.userId) return null;
    if (device.lastActiveDate !== new Date(dto.iat * 1000).toISOString())
      return null;
    return await this.devicesService.deleteOneDevice(dto);
  }

  async passwordRecovery(email: string) {
    const user = await this.usersRepo.getUserByEmailOrLogin(email);

    if (!user) return;

    const recoveryCode = await this.usersService.updatePasswordRecovery(
      user._id,
    );

    await this.emailService.sendPasswordRecoveryEmail(email, recoveryCode);

    return;
  }

  async newPassword(dto: newPasswordDto) {
    const { newPassword, recoveryCode } = dto;

    const result = await this.usersService.newPassword(
      newPassword,
      recoveryCode,
    );

    if (!result) return null;

    return;
  }
}
