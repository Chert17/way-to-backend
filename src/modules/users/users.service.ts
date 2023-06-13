import { Injectable } from '@nestjs/common';

import { generateHash } from '../../helpers/generate.hash';
import { CreateUserServiceDto } from './dto/create-user.dto';
import { UsersRepo } from './repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async create(dto: CreateUserServiceDto): Promise<{ userId: string }> {
    return this.usersRepo.createUser({
      ...dto,
      createdAt: new Date().toISOString(),
      pass_hash: await generateHash(dto.password),
    });
  }

  // remove(id: string) {}
}
