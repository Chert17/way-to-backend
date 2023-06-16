import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { RegisterDbDto } from '../../auth/dto/input/register.dto';
import { BanUserDbDto } from '../dto/ban.user.dto';
import { CreateUserDbDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

const { USERS_BAN_INFO_TABLE, USERS_TABLE, USERS_CONFIRM_EMAIL } =
  UsersSqlTables;

@Injectable()
export class UsersRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDbDto): Promise<{ userId: string }> {
    //TODO возможно чтоб различать кто создал юзера добавить type sa, так как у юзеров которых создал sa нет confirm_email // ?
    const { email, login, pass_hash, createdAt } = dto;

    const result = await this.dataSource.query(`
    INSERT INTO ${USERS_TABLE} ("login", "email", "pass_hash", "created_at")
    VALUES ('${login}', '${email}', '${pass_hash}', '${createdAt}')
    RETURNING id 
   `);

    return { userId: result[0].id };
  }

  async registerUser(dto: RegisterDbDto) {
    const { userId, confirmCode, isConfirmed, exprDate } = dto;

    return this.dataSource.query(
      `
    insert into ${USERS_CONFIRM_EMAIL} ("user_id", "is_confirmed", "confirm_code", "expr_date")
    values ($1, $2, $3, $4)
    `,
      [userId, isConfirmed, confirmCode, exprDate],
    );
  }

  async getConfirmEmailImfoByCode(
    code: string,
  ): Promise<{ is_confirmed: boolean; expr_date: string }[]> {
    return this.dataSource.query(
      `
    select is_confirmed, expr_date from ${USERS_CONFIRM_EMAIL}
    where confirm_code = $1
    `,
      [code],
    );
  }

  async setConfirmRegister(code: string) {
    return this.dataSource.query(
      `
    update ${USERS_CONFIRM_EMAIL}
    set is_confirmed = true
    where confirm_code = $1
    `,
      [code],
    );
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

  async deleteUser(userId: string) {
    return this.dataSource.query(
      `
      delete from ${USERS_TABLE} where id = $1
    `,
      [`${userId}`],
    );
  }

  async checkUserById(userId: string): Promise<User[]> {
    return this.dataSource.query(
      `SELECT * FROM ${USERS_TABLE} u WHERE u.id = '${userId}'`,
    );
  }
}
