import { DataSource } from 'typeorm';

import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UsersSqlTables } from '../../utils/tables/users.sql.tables';

const { USERS_TABLE } = UsersSqlTables;

@Controller('testing/all-data')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete() {
    return this.dataSource.query(`TRUNCATE ${USERS_TABLE} CASCADE`);
  }
}
