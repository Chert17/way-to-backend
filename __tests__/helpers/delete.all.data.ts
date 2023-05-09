import request from 'supertest';

import { app } from '../../src/setting';
import { STATUS_CODE } from '../../src/utils/status.code';

export const deleteAllData = async () =>
  await request(app).delete('/testing/all-data').expect(STATUS_CODE.NO_CONTENT);
