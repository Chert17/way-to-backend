import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { CreateDevicesDbDto } from '../dto/create.device.dto';

const { USERS_DEVICES_TABLE } = UsersSqlTables;

@Injectable()
export class DevicesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createDevice(dto: CreateDevicesDbDto) {
    const { userId, deviceId, ip, title, lastActiveDate } = dto;

    return await this.dataSource.query(
      `
    insert into ${USERS_DEVICES_TABLE} ("user_id", "device_id", "ip", "title", "last_active_date")
    values ($1, $2, $3, $4, $5)
     `,
      [userId, deviceId, ip, title, lastActiveDate],
    );
  }
}
