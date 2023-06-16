import { isUUID } from 'class-validator';

import { Injectable, NotFoundException } from '@nestjs/common';

import { generateHash } from '../../helpers/generate.hash';
import { CreateUserServiceDto } from './dto/create-user.dto';
import { UsersRepo } from './repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async createUser(dto: CreateUserServiceDto): Promise<{ userId: string }> {
    return this.usersRepo.createUser({
      ...dto,
      createdAt: new Date().toISOString(),
      pass_hash: await generateHash(dto.password),
      format: dto.format,
    });
  }

  async checkUserById(userId: string) {
    if (!isUUID(userId)) throw new NotFoundException();

    const user = await this.usersRepo.checkUserById(userId);

    if (!user) throw new NotFoundException();

    return { id: userId };
  }
}
