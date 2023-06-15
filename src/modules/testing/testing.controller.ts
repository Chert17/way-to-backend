import { Repository } from 'typeorm';

import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';

@Controller('testing/all-data')
export class TestingController {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete() {
    this.usersRepo.delete({});

    return;
  }
}
