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
    WITH 
    confirm_email AS (
      INSERT INTO users_confirm_email ("is_confirmed") 
      VALUES ('false')
      RETURNING id
    ),
     recovery_password AS (
      INSERT INTO users_recovery_password ("is_confirmed") 
      VALUES ('false')
      RETURNING id
    ),
    ban_info AS (
      INSERT INTO users_ban_info ("is_banned") 
      VALUES ('false')
      RETURNING id
    )
  INSERT INTO users ("login", "email", "pass_hash", "created_at", "ban_info_id", "confirm_email_id", "recovery_password_id")
  SELECT '${login}', '${email}', '${pass_hash}', '${createdAt}', ban_info.id, confirm_email.id, recovery_password.id
  FROM ban_info, confirm_email, recovery_password
  RETURNING id 
   `);

    return { userId: result[0].id };
  }
}
