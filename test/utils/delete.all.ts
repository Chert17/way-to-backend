import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

export const deleteAllData = async (app: INestApplication) =>
  await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
