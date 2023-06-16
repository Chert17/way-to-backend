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
    it('should be ban user', async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server)
        .put(SA_URL + `/${user[0].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true, banReason: 'banned user banned user' });

      const getRes = await request(server)
        .get(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .query({ banStatus: 'banned' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.items).toHaveLength(1);
    });

    it('should be unban user', async () => {
      const banUser = await userTest.createBanUsers(1);

      const res = await request(server)
        .put(SA_URL + `/${banUser[0].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: false, banReason: null });

      const getRes = await request(server)
        .get(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .query({ banStatus: 'banned' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.items).toHaveLength(0);
    });

    it("shouldn't ban user with incorrect data", async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server)
        .put(SA_URL + `/${user[0].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: null, banReason: '' });

      const errors = errorsData('isBanned', 'banReason');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't ban user if no auth", async () => {
      const user = await userTest.createUsers(1);

      const res = await request(server).put(SA_URL + `/${user[0].id}/ban`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't ban user if userId not exist", async () => {
      const res = await request(server)
        .put(SA_URL + `/2a2044a2-3ff3-47fe-88be-e66c1c8bfdc6/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true, banReason: 'banned user banned user' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('get all users', () => {
    it('should be returned users with pagination', async () => {
      const users = await userTest.createUsers(1);
      const banUsers = await userTest.createBanUsers(1);

      const res = await request(server)
        .get(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .query({ banStatus: 'all' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.items).toHaveLength(2);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: banUsers[0].id,
            login: banUsers[0].login,
            email: banUsers[0].email,
            createdAt: expect.any(String),
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(String),
            },
          },
          {
            id: users[0].id,
            login: users[0].login,
            email: users[0].email,
            createdAt: expect.any(String),
            banInfo: {
              isBanned: false,
              banDate: null,
              banReason: null,
            },
          },
        ],
      });
    });

    it('should be returned users with ban users pagination', async () => {
      const banUsers = await userTest.createBanUsers(2);
      await userTest.createUsers(1);

      const res = await request(server)
        .get(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .query({ banStatus: 'banned', sortDirection: 'asc' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.items).toHaveLength(2);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: banUsers[0].id,
            login: banUsers[0].login,
            email: banUsers[0].email,
            createdAt: expect.any(String),
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(String),
            },
          },
          {
            id: banUsers[1].id,
            login: banUsers[1].login,
            email: banUsers[1].email,
            createdAt: expect.any(String),
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(String),
            },
          },
        ],
      });
    });

    it("shouldn't get user if no auth", async () => {
      const res = await request(server).get(SA_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('delete user', () => {
    it('should delete user', async () => {
      const users = await userTest.createUsers(1);

      const res = await request(server)
        .delete(SA_URL + `/${users[0].id}`)
        .auth(admin.login, admin.password, { type: 'basic' });

      const getRes = await request(server)
        .get(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.items).toHaveLength(0);
    });

    it("shouldn't delete user if no auth", async () => {
      const users = await userTest.createUsers(1);

      const res = await request(server).delete(SA_URL + `/${users[0].id}`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't delete user if userId no exist", async () => {
      const res = await request(server)
        .delete(SA_URL + '2a2044a2-3ff3-47fe-88be-e66c1c8bfdc6')
        .auth(admin.login, admin.password, { type: 'basic' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
