import { DataSource } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { initApp } from '../../src/utils/init.app/init.app';

export const myBeforeAll = async () => {
  let app: INestApplication;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app = initApp(app);
  await app.init();
  const server = app.getHttpServer();

  const dataSource = app.get(DataSource);

  return { myApp: app, myServer: server, dataSource: dataSource.manager };
};
