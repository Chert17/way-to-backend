import { randomUUID } from 'crypto';
import { Types, UpdateWriteOpResult } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { addMinutesToCurrentDate } from '../../helpers/add.minutes.current.date';
import { generateHash } from '../../helpers/generate.hash';
import { DbType } from '../../types/db.interface';
import { CommentsService } from '../comments/comments.service';
import { DevicesService } from '../devices/devices.service';
import { PostsService } from '../posts/posts.service';
import { BanUserServiceDto } from './dto/input/ban.user.dto';
import { CreateUserDto } from './dto/input/create.user.dto';
import { UsersRepo } from './repositories/users.repo';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepo,
    private devicesService: DevicesService,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<DbType<User>> {
    const newUser = await this._userData(dto);

    return await this.usersRepo.createUser(newUser);
  }

  async deleteUser(userId: string) {
    const user = this.usersRepo.checkAndGetUserById(userId);

    if (!user) return false;

    return await this.usersRepo.deleteUser(userId);
  }

  async registerUser(dto: CreateUserDto): Promise<DbType<User>> {
    const newUser = await this._userData(dto);

    newUser.emailInfo.isConfirmed = false;
    newUser.passwordRecoveryInfo.isConfirmed = false;

    return await this.usersRepo.createUser(newUser);
  }

  async updateConfirmEmailStatus(code: string): Promise<UpdateWriteOpResult> {
    return await this.usersRepo.updateConfirmEmailStatus(code); // maybe handle the failed ConfirmEmail status update error
  }

  async updatePasswordRecovery(userId: Types.ObjectId) {
    const recoveryCode = randomUUID();
    const expDate = addMinutesToCurrentDate(2); // add 2 minutes to expirationDate

    await this.usersRepo.updatePasswordRecoveryInfo(
      userId,
      recoveryCode,
      expDate,
    );

    return recoveryCode;
  }

  async newPassword(newPassword: string, recoveryCode: string) {
    const userPasswordRecoveryInfo =
      await this.usersRepo.getUserPasswordInfoByRecoveryPassword(recoveryCode);

    const { userId, expirationDate, isConfirmed } = userPasswordRecoveryInfo;

    if (!userPasswordRecoveryInfo) return null;

    if (isConfirmed === true) return null;

    if (expirationDate < new Date()) return null;

    const passwordHash = await generateHash(newPassword);

    return await this.usersRepo.createNewPasswordForUser(userId, passwordHash);
  }

  async banUser(dto: BanUserServiceDto) {
    const isBan = dto.isBanned;

    const banDate = isBan ? new Date() : null;
    const banReason = isBan ? dto.banReason : null;

    await this.usersRepo.updateIsBanUser({ ...dto, banDate, banReason }); // add ban user info to user

    await this.postsService.updateBanUserInfoForPostLike(
      dto.userId,
      dto.isBanned,
    );

    await this.commentsService.updateBanUserInfoForCommnetsAndLikes(
      dto.userId,
      dto.isBanned,
    );
    if (isBan) await this.devicesService.deleteAllDevicesByBanUser(dto.userId);

    return;
  }

  private async _userData(dto: CreateUserDto): Promise<User> {
    const { login, email, password } = dto;

    return {
      accountData: {
        login,
        email,
        passwordHash: await generateHash(password),
        createdAt: new Date(),
      },
      emailInfo: {
        confirmationCode: randomUUID(),
        isConfirmed: true,
        expirationDate: addMinutesToCurrentDate(2), // add 2 minutes to expirationDate
      },
      passwordRecoveryInfo: {
        recoveryCode: null,
        isConfirmed: true,
        expirationDate: new Date(),
      },
      banInfo: {
        banReason: null,
        banDate: null,
        isBanned: false,
      },
    };
  }
}
