import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { UserViewDto } from '../dto/user.view.dto';

const { USERS_TABLE } = UsersSqlTables;

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUserById(userId: string): Promise<UserViewDto> {
    const user = await this.dataSource.query(
      `SELECT id, login, email, created_at AS "createdAt"
      FROM ${USERS_TABLE} u
      WHERE u.id = '${userId}'`,
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
