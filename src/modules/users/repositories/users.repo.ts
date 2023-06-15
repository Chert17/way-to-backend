import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { CreateUserDbDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDbDto): Promise<{ userId: string }> {
    const { email, login, pass_hash, createdAt } = dto;

    const result = await this.dataSource.query(`
  INSERT INTO users ("login", "email", "pass_hash", "created_at")
  VALUES ('${login}', '${email}', '${pass_hash}', '${createdAt}')
  RETURNING id 
   `);

    return { userId: result[0].id };
  }
}
