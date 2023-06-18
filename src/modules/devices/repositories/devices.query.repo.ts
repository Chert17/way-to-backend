import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';

const { USERS_DEVICES_TABLE } = UsersSqlTables;

@Injectable()
export class DevicesQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getAllDevices(userId: string) {
    return this.dataSource.query(
      `
   select ip, title, device_id as "deviceId", last_active_date as "lastActiveDate"
   from ${USERS_DEVICES_TABLE}
   where user_id = $1
      `,
      [userId],
    );
  }
}
