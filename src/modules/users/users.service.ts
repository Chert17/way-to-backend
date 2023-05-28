import { Injectable } from '@nestjs/common';

import { generateHash } from '../../helpers/generate.hash';
import { DbType } from '../../types/db.interface';
import { CreateUserDto } from './dto/input/create.user.dto';
import { UsersRepo } from './repositories/users.repo';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async createUser(dto: CreateUserDto): Promise<DbType<User>> {
    const { email, login, password } = dto;

    const passwordHash = await generateHash(password);

    const newUser: User = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      isConfirm: true,
    };

    return await this.usersRepo.createUser(newUser);
  }

  async deleteUser(userId: string) {
    const user = this.usersRepo.checkUserById(userId);

    if (!user) return false;

    return await this.usersRepo.deleteUser(userId);
  }
}
