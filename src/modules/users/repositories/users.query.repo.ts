import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectRepository(User) private userQueryRepo: Repository<User>,
  ) {}
}
