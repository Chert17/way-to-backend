import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { authEndpoints } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import { UserTest } from './helpers/fabrica';
import { getRefreshTokenNameFromCookie } from './helpers/get.refresh.token';
import { myBeforeAll } from './helpers/my.before.all';

const { REGISTER_URL, LOGIN_URL, CONFIRM_REGISTER_URL, RESENDING_EMAIL_URL } =
  authEndpoints;

describe('auth e2e', () => {
  let server: any;

  let userTest: UserTest;

  beforeAll(async () => {
    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('register', () => {
    it('should be register user', async () => {
      const { email, login, password } = userTest._createtUserData();

      const res = await request(server)
        .post(REGISTER_URL)
        .send({ email, login, password });

      const { confirmCode } = await userTest.getConfirmEmailCodeByUser(email);

      const emailRes = await request(server)
        .post(CONFIRM_REGISTER_URL)
        .send({ code: confirmCode });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(emailRes.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("shouldn't register if incorrect code", async () => {
      const { email, login, password } = userTest._createtUserData();

      const res = await request(server)
        .post(REGISTER_URL)
        .send({ email, login, password });

      const emailRes = await request(server)
        .post(CONFIRM_REGISTER_URL)
        .send({ code: 'a6db59ed-2550-404d-801a-244d3115cf82' });

      const errors = errorsData('code');

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(emailRes.status).toBe(HttpStatus.BAD_REQUEST);
      expect(emailRes.body).toEqual(errors);
    });

    it("shouldn't register user with incorrect data", async () => {
      const { login, password } = userTest._createtUserData();

      const res = await request(server)
        .post(REGISTER_URL)
        .send({ login, password });

      const errors = errorsData('email');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });
  });

  describe('login', () => {
    it('should be login user', async () => {
      const users = await userTest.createUsers(1);

      const res = await request(server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: users[0].email, password: users[0].password })
        .set('User-Agent', 'my test');

      const refreshTokenName = getRefreshTokenNameFromCookie(res);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(refreshTokenName).toBeDefined();
    });

    it("shouldn't login user with incorrect data", async () => {
      const users = await userTest.createUsers(1);

      const res = await request(server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: users[0].email });

      const errors = errorsData('password');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("should't login user with password or login wrong", async () => {
      const users = await userTest.createUsers(1);

      const res = await request(server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: users[0].email, password: '123123' });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should't login user if banned user", async () => {
      const [banUser0] = await userTest.createBanUsers(1);

      const res = await request(server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: banUser0.email, password: banUser0.password });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should't login user if not confirm email", async () => {
      const { email, login, password } = userTest._createtUserData();

      const res = await request(server)
        .post(REGISTER_URL)
        .send({ email, login, password });

      const loginRes = await request(server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: email, password: password });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(loginRes.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('email resending', () => {
    it('should be email resending', async () => {
      const { email, login, password } = userTest._createtUserData();

      await request(server).post(REGISTER_URL).send({ email, login, password });

      const res = await request(server)
        .post(RESENDING_EMAIL_URL)
        .send({ email: email });

      const { confirmCode } = await userTest.getConfirmEmailCodeByUser(email);

      const emailRes = await request(server)
        .post(CONFIRM_REGISTER_URL)
        .send({ code: confirmCode });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(emailRes.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("should't email resending if incorrect email", async () => {
      const { email, login, password } = userTest._createtUserData();

      await request(server).post(REGISTER_URL).send({ email, login, password });

      const res = await request(server)
        .post(RESENDING_EMAIL_URL)
        .send({ email: 'zxczxc@gmail.com' });

      const errors = errorsData('email');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });
  });
});
