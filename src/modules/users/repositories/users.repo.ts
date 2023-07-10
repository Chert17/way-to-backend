import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { EmailResendingDbDto } from '../../auth/dto/input/email.resending.dto';
import { RecoveyPassowrdDbDto } from '../../auth/dto/input/recovery.password.dto';
import { RegisterDbDto } from '../../auth/dto/input/register.dto';
import { RecoveryPassDb } from '../../auth/types/recovery.pass.types';
import { UserWithEmailInfoAndBanInfo } from '../../auth/types/user.types';
import { BanUserDbDto } from '../dto/ban.user.dto';
import { CreateUserDbDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

const {
  USERS_BAN_INFO_TABLE,
  USERS_TABLE,
  USERS_CONFIRM_EMAIL_TABLE,
  USERS_RECOVERY_PASS_TABLE,
  USERS_CONFIRM_TELEGRAM_TABLE,
} = UsersSqlTables;

@Injectable()
export class UsersRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDbDto): Promise<{ userId: string }> {
    //TODO возможно чтоб различать кто создал юзера добавить type sa, так как у юзеров которых создал sa нет confirm_email // ?
    const { email, login, pass_hash, createdAt, format } = dto;

    const result = await this.dataSource.query(`
    INSERT INTO ${USERS_TABLE} ("login", "email", "pass_hash", "created_at", "format")
    VALUES ('${login}', '${email}', '${pass_hash}', '${createdAt}', '${format}')
    RETURNING id 
   `);

    return { userId: result[0].id };
  }

  async registerUser(dto: RegisterDbDto) {
    const { userId, confirmCode, isConfirmed, exprDate } = dto;

    return this.dataSource.query(
      `
    insert into ${USERS_CONFIRM_EMAIL_TABLE} ("user_id", "is_confirmed", "confirm_code", "expr_date")
    values ($1, $2, $3, $4)
    `,
      [userId, isConfirmed, confirmCode, exprDate],
    );
  }

  async getConfirmEmailInfoByCode(
    code: string,
  ): Promise<{ is_confirmed: boolean; expr_date: string }> {
    const result = await this.dataSource.query(
      `
    select is_confirmed, expr_date from ${USERS_CONFIRM_EMAIL_TABLE}
    where confirm_code = $1
    `,
      [code],
    );

    return result[0];
  }

  async getConfirmEmailInfoByEmail(
    email: string,
  ): Promise<{ is_confirmed: boolean; expr_date: string }> {
    const result = await this.dataSource.query(
      `
    select is_confirmed, expr_date from ${USERS_CONFIRM_EMAIL_TABLE} e
    left join ${USERS_TABLE} u on u.email = $1
    where e.user_id = u.id
    `,
      [email],
    );

    return result[0];
  }

  async updateConfirmEmailInfo(dto: EmailResendingDbDto) {
    const { email, newCode, newExpDate } = dto;

    return this.dataSource.query(
      `
    update ${USERS_CONFIRM_EMAIL_TABLE} e
    set confirm_code = $2, expr_date = $3
    where user_id = (
      select id
      from ${USERS_TABLE}
      where email = $1
    )
    `,
      [email, newCode, newExpDate],
    );
  }

  async setConfirmRegister(code: string) {
    return this.dataSource.query(
      `
    update ${USERS_CONFIRM_EMAIL_TABLE}
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

  async createRecoveryPassInfo(dto: RecoveyPassowrdDbDto) {
    const { expDate, recoveryCode, userId } = dto;

    return this.dataSource.query(
      `
    insert into ${USERS_RECOVERY_PASS_TABLE} ("recovery_code", "expr_date", "user_id")
    values ($2, $3, $1)
    `,
      [userId, recoveryCode, expDate],
    );
  }

  async getRecoveryPassInfoByCode(code: string): Promise<RecoveryPassDb> {
    const result = await this.dataSource.query(
      `
    select * from ${USERS_RECOVERY_PASS_TABLE} where recovery_code = $1
    `,
      [code],
    );

    return result[0];
  }

  async setNewPass(userId: string, passHash: string) {
    return this.dataSource.query(
      `
    update ${USERS_TABLE}
    set pass_hash = $2
    where id = $1
    `,
      [userId, passHash],
    );
  }

  async addTelegramConfirmCode(userId: string, code: string) {
    await this.dataSource.query(
      `
    INSERT INTO ${USERS_CONFIRM_TELEGRAM_TABLE} ("user_id", "confirm_code")
    VALUES ($1, $2)
    `,
      [userId, code],
    );
  }

  async checkUserById(userId: string): Promise<User> {
    const result = await this.dataSource.query(
      `SELECT * FROM ${USERS_TABLE} u WHERE u.id = '${userId}'`,
    );

    return result[0];
  }

  async checkUserWithEmailInfoAndBanInfoByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserWithEmailInfoAndBanInfo> {
    const result = await this.dataSource.query(
      `
    select u.*, e.is_confirmed, b.is_banned
    from ${USERS_TABLE} u
    left join ${USERS_CONFIRM_EMAIL_TABLE} e on u.id = e.user_id
    left join ${USERS_BAN_INFO_TABLE} b on u.id = b.user_id
    where u.login = $1 or u.email = $1
    `,
      [loginOrEmail],
    );

    return result[0];
  }

  async checkBanUserById(userId: string): Promise<{ is_banned: boolean }> {
    const result = await this.dataSource.query(
      `
    select b.is_banned from ${USERS_TABLE} u
    left join ${USERS_BAN_INFO_TABLE} b on u.id = b.user_id
    where u.id = $1
    `,
      [userId],
    );

    return result[0];
  }

  async checkUserByEmail(email: string): Promise<User> {
    const result = await this.dataSource.query(
      `
    select * from ${USERS_TABLE} where email = $1
    `,
      [email],
    );

    return result[0];
  }
}
