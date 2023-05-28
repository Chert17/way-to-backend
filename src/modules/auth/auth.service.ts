import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/input/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: RegisterDto) {
    await this.usersService.createUser(dto);
  }
}
