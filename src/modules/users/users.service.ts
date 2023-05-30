import { randomUUID } from 'crypto';
import { UpdateWriteOpResult } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { generateHash } from '../../helpers/generate.hash';
import { DbType } from '../../types/db.interface';
import { CreateUserDto } from './dto/input/create.user.dto';
import { UsersRepo } from './repositories/users.repo';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async createUser(dto: CreateUserDto): Promise<DbType<User>> {
    const newUser = await this._userData(dto);

    return await this.usersRepo.createUser(newUser);
  }

  async deleteUser(userId: string) {
    const user = this.usersRepo.checkUserById(userId);

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
        expirationDate: new Date(new Date().getTime() + 60000 * 2), // add 2 minutes to expirationDate
      },
      passwordRecoveryInfo: {
        recoveryCode: null,
        isConfirmed: true,
      },
    };
  }
}
