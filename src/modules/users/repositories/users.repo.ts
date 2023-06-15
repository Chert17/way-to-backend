import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { BanUserDbDto } from '../dto/ban.user.dto';
import { CreateUserDbDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

const { USERS_BAN_INFO_TABLE, USERS_TABLE } = UsersSqlTables;

@Injectable()
export class UsersRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDbDto): Promise<{ userId: string }> {
    const { email, login, pass_hash, createdAt } = dto;

    const result = await this.dataSource.query(`
    INSERT INTO ${USERS_TABLE} ("login", "email", "pass_hash", "created_at")
    VALUES ('${login}', '${email}', '${pass_hash}', '${createdAt}')
    RETURNING id 
   `);

    return { userId: result[0].id };
  }

  async banUser(dto: BanUserDbDto) {
    const { userId, banReason, isBanned, banDate } = dto;

    return this.dataSource.query(`
    DO $$
      BEGIN
        IF ${isBanned} THEN
          INSERT INTO ${USERS_BAN_INFO_TABLE} (user_id, ban_reason, is_banned, ban_date)
          VALUES ('${userId}', '${banReason}', ${isBanned}, '${banDate}');
      ELSE
          DELETE FROM ${USERS_BAN_INFO_TABLE} WHERE user_id = '${userId}';
      END IF;
    END $$;`);
  }

  async checkUserById(userId: string): Promise<User> {
    return this.dataSource.query(
      `SELECT * FROM ${USERS_TABLE} u WHERE u.id = '${userId}'`,
    );
  }
}
