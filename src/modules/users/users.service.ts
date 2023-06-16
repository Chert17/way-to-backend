import { isUUID } from 'class-validator';

import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepo } from './repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async checkUserById(userId: string) {
    const isUuid = isUUID(userId);

    if (!isUuid) throw new NotFoundException();

    const user = await this.usersRepo.checkUserById(userId);

    if (!user.length) throw new NotFoundException();

    return { id: userId };
  }
}
