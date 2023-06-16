import { isUUID } from 'class-validator';

import { Injectable, NotFoundException } from '@nestjs/common';

import { generateHash } from '../../helpers/generate.hash';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepo } from './repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async createUser(dto: CreateUserDto): Promise<{ userId: string }> {
    return this.usersRepo.createUser({
      ...dto,
      createdAt: new Date().toISOString(),
      pass_hash: await generateHash(dto.password),
    });
  }

  async checkUserById(userId: string) {
    const isUuid = isUUID(userId);

    if (!isUuid) throw new NotFoundException();

    const [user] = await this.usersRepo.checkUserById(userId);

    if (!user) throw new NotFoundException();

    return { id: userId };
  }
}
