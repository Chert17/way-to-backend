import { DataSource } from 'typeorm';

import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('testing/all-data')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete() {
    this.dataSource.query(`TRUNCATE users CASCADE`);

    return;
  }
}
