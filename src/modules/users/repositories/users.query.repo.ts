import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserViewDto } from '../dto/user.view.dto';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUserById(userId: string): Promise<UserViewDto> {
    const user = await this.dataSource.query(
      `SELECT id, login, email, created_at AS "createdAt"
      FROM users
      WHERE id = '${userId}'`,
    );

    return {
      ...user[0],
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
  }
}