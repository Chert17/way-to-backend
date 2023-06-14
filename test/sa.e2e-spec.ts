import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { SA_URL } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import { admin, UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

describe('super admin e2e', () => {
  let server: any;

  let userTest: UserTest;

  beforeAll(async () => {
    const { myServer } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('create user', () => {
    it('should be create user with correct data', async () => {
      const res = await request(server)
        .post(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ login: 'qwe', email: 'qwe@gmail.com', password: 'qweqweqwe' });

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        login: 'qwe',
        email: 'qwe@gmail.com',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });
    });

    it("shouldn't create user with incorrect data", async () => {
      const res = await request(server)
        .post(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ login: 'qwe', email: '', password: '' });

      const erros = errorsData('password', 'email');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(erros);
    });

    it("shouldn't create user if no auth", async () => {
      const res = await request(server).post(SA_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('ban user', () => {
    it('should ban user', async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server)
        .put(SA_URL + `${user[0].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true, banReason: 'test test test' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("shouldn't ban user with incorrect data", async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server)
        .put(SA_URL + `${user[0].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: null, banReason: '' });

      const errors = errorsData('isBanned', 'banReason');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't ban user if no auth", async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server).put(SA_URL + `${user[0].id}/ban`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});