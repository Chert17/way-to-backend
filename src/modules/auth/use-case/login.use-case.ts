import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';

import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DevicesRepo } from '../../devices/repositories/devices.repo';
import { UsersRepo } from '../../users/repositories/users.repo';
import { CreateUserFormat } from '../../users/types/user.types';
import { LoginServiceDto } from '../dto/input/login.dto';
import { JwtService } from '../jwt.service';

export class LoginUserCommand {
  constructor(public dto: LoginServiceDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
    private devicesRepo: DevicesRepo,
  ) {}

  async execute({ dto }: LoginUserCommand) {
    const user =
      await this.usersRepo.checkUserWithEmailInfoAndBanInfoByLoginOrEmail(
        dto.loginOrEmail,
      );

    if (!user) throw new UnauthorizedException();

    if (user.is_banned) throw new UnauthorizedException();

    const pass = await compare(dto.password, user.pass_hash);

    if (!pass) throw new UnauthorizedException();

    if (!user.is_confirmed && user.format === CreateUserFormat.REGISTER) {
      throw new UnauthorizedException();
    }

    const deviceId = randomUUID();

    const tokens = this.jwtService.createJWT(user.id, deviceId);

    const { iat } = this.jwtService.getTokenIat(tokens.refreshToken);

    await this.devicesRepo.createDevice({
      userId: user.id,
      deviceId,
      ip: dto.ip,
      title: dto.userAgent,
      lastActiveDate: iat,
    });

    return tokens;
  }
}
