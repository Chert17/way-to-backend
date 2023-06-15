import { Injectable } from '@nestjs/common';

import { UsersRepo } from './repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  // async create(dto: CreateUserServiceDto): Promise<{ userId: string }> {
  //   return this.usersRepo.createUser({
  //     ...dto,
  //     createdAt: new Date().toISOString(),
  //     pass_hash: await generateHash(dto.password),
  //   });
  // }

  // remove(id: string) {}
}
