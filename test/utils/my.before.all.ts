import { AppModule } from 'src/app.module';
import { initApp } from 'src/utils/init.app/init.app';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { deleteAllData } from './delete.all';

export const mybeforeAll = async () => {
  let app: INestApplication;
  let agent: request.SuperTest<request.Test>;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  initApp(app);

  await app.init();

  agent = request.agent(app.getHttpServer());

  await deleteAllData(app);

  return { app, agent };
};
