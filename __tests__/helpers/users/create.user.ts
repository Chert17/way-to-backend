import request from 'supertest';

import { app } from '../../../src/setting';
import { STATUS_CODE } from '../../../src/utils/status.code';
import { USER_URL, validUserData } from '../../data/user.data';

export const createUser = async () =>
  await request(app)
    .post(USER_URL)
    .auth('admin', 'qwerty', { type: 'basic' })
    .send(validUserData)
    .expect(STATUS_CODE.CREATED);
