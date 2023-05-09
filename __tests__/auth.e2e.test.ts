import request from 'supertest';

import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { AUTH_URL, validLoginData } from './data/auth.data';
import { validUserData } from './data/user.data';
import { deleteAllData } from './helpers/delete.all.data';
import { createUser } from './helpers/users/create.user';

describe('auth', () => {
  beforeAll(async () => {
    await deleteAllData();
  });

  it('POST -> "/auth/login": should sign in user; status 200; content: JWT token', async () => {
    await createUser();

    const loginResponse = await request(app)
      .post(AUTH_URL + '/login')
      .send(validLoginData)
      .expect(STATUS_CODE.OK);

    const { accessToken } = loginResponse.body;

    expect(accessToken);
  });

  it('!POST -> "/auth/login": should return error if passed wrong login or password; status 401', async () => {
    await request(app)
      .post(AUTH_URL + '/login')
      .send({ loginOrEmail: '-123', password: validUserData.password })
      .expect(STATUS_CODE.UNAUTHORIZED);
  });
});
