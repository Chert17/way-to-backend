import { Repository } from 'typeorm';

import { Controller, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';

@Controller('testing/all-data')
export class TestingController {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  @Delete()
  async delete() {
    await this.usersRepo.delete({});
  }
}
