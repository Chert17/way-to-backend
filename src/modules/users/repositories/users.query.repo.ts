import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserViewDto } from '../dto/user.view.dto';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUserById(userId: string): Promise<UserViewDto> {
    const user = await this.dataSource.query(
      `SELECT
        u.id,
        u.login,
        u.email,
        u.created_at AS "createdAt",
      JSON_BUILD_OBJECT(
        'isBanned', b.is_banned,
        'banDate', b.ban_date,
        'banReason', b.ban_reason
    ) AS "banInfo"
      FROM
        users u
      LEFT JOIN
        users_ban_info b ON u.ban_info_id = b.id
      WHERE
        u.id = '${userId}'`,
    );

    return user[0];
  }
}
