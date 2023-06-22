import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { CreateDevicesDbDto } from '../dto/create.device.dto';
import { DeleteDeviceDbDto } from '../dto/delete.device.dto';
import { UpdateDeviceDbDto } from '../dto/update.device.dto';
import { DeviceDb } from '../types/device.db';

const { USERS_DEVICES_TABLE } = UsersSqlTables;

@Injectable()
export class DevicesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getDeviceById(deviceId: string): Promise<DeviceDb> {
    const result = await this.dataSource.query(
      `
    select * from ${USERS_DEVICES_TABLE} where device_id = $1
    `,
      [deviceId],
    );

    return result[0];
  }

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

  async updateDevice(dto: UpdateDeviceDbDto) {
    const { deviceId, ip, lastActiveDate, userId } = dto;

    return this.dataSource.query(
      `
  update ${USERS_DEVICES_TABLE} 
  set last_active_date = $4, ip = $3
  where user_id = $1 and device_id = $2
  `,
      [userId, deviceId, ip, lastActiveDate],
    );
  }

  async deleteOneDevice(dto: DeleteDeviceDbDto) {
    const { userId, deviceId } = dto;

    return this.dataSource.query(
      `
    delete from ${USERS_DEVICES_TABLE} where user_id = $1 and device_id = $2
    `,
      [userId, deviceId],
    );
  }

  async deleteDevicesExceptCurrent(userId: string, deviceId: string) {
    return this.dataSource.query(
      `
      delete from ${USERS_DEVICES_TABLE} where user_id = $1 and device_id <> $2
    `,
      [userId, deviceId],
    );
  }

  async deleteAllDevicesIfBanUser(userId: string) {
    return this.dataSource.query(
      `
      delete from ${USERS_DEVICES_TABLE} where user_id = $1
    `,
      [userId],
    );
  }
}
