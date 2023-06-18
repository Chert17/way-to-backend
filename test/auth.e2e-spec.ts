import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { authEndpoints } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import { UserTest } from './helpers/fabrica';
import { getRefreshToken } from './helpers/get.refresh.token';
import { myBeforeAll } from './helpers/my.before.all';

const {
  REGISTER_URL,
  LOGIN_URL,
  CONFIRM_REGISTER_URL,
  RESENDING_EMAIL_URL,
  REFRESH_TOKEN_URL,
  LOGOUT_URL,
  GET_ME,
  RECOVERY_PASS_URL,
  NEW_PASS_URL,
} = authEndpoints;

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

      const { confirmCode } = await userTest.getConfirmEmailCode(email);

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

      const { name } = getRefreshToken(res);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(name).toBeDefined();
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

      const { confirmCode } = await userTest.getConfirmEmailCode(email);

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

  describe('refresh token', () => {
    it('should be return new pair tokens', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const res = await request(server)
        .post(REFRESH_TOKEN_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user0.userAgent);

      const { name } = getRefreshToken(res);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(name).toBeDefined();
    });

    it("shouldn't get new tokens if incorrect refresh token", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

      await sleep(1500);

      const res = await request(server)
        .post(REFRESH_TOKEN_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user0.userAgent);

      const res2 = await request(server)
        .post(REFRESH_TOKEN_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user0.userAgent);

      const { name } = getRefreshToken(res);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(name).toBeDefined();
      expect(res2.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't get new tokens if other user-agent", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const res = await request(server)
        .post(REFRESH_TOKEN_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user0.userAgent);

      const { name, value } = getRefreshToken(res);

      const res2 = await request(server)
        .post(REFRESH_TOKEN_URL)
        .set('Cookie', `refreshToken=${value}`)
        .set('User-Agent', user1.userAgent);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(name).toBeDefined();
      expect(res2.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('logout', () => {
    it('should be logout user', async () => {
      const [user0] = await userTest.createLoginUsers(2);

      const res = await request(server)
        .post(LOGOUT_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user0.userAgent);

      const devices = await userTest.getUserDevices();

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(devices.length).toBe(1);
    });

    it("shouldn't logout if no refresh token in cookie", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const res = await request(server)
        .post(LOGOUT_URL)
        .set('User-Agent', user0.userAgent);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't logout ifother user-agent", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const res = await request(server)
        .post(LOGOUT_URL)
        .set('Cookie', `refreshToken=${user0.refreshToken}`)
        .set('User-Agent', user1.userAgent);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get me', () => {
    it('should be returned get me', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const res = await request(server)
        .get(GET_ME)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        userId: user0.id,
        email: user0.email,
        login: user0.login,
      });
    });

    it("shouldn't returned get me if no auth", async () => {
      await userTest.createLoginUsers(1);

      const res = await request(server).get(GET_ME);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('recovery password', () => {
    it('should be recovery pass', async () => {
      const { email, login, password } = userTest._createtUserData();

      await request(server).post(REGISTER_URL).send({ email, login, password });

      const res = await request(server).post(RECOVERY_PASS_URL).send({ email });

      const { recoveryCode } = await userTest.getRecoveryCode(email);

      const passRes = await request(server)
        .post(NEW_PASS_URL)
        .send({ newPassword: 'newPass123', recoveryCode: recoveryCode });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(passRes.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("shouldn't recovery pass if user email no register", async () => {
      const { email } = userTest._createtUserData();

      const res = await request(server).post(RECOVERY_PASS_URL).send({ email });

      const { recoveryCode } = await userTest.getRecoveryCode(email);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(recoveryCode).toBeNull();
    });

    it("shouldn't recovery pass if incorreect code", async () => {
      const { email, login, password } = userTest._createtUserData();

      await request(server).post(REGISTER_URL).send({ email, login, password });

      const res = await request(server).post(RECOVERY_PASS_URL).send({ email });

      const passRes = await request(server).post(NEW_PASS_URL).send({
        newPassword: 'newPass123',
        recoveryCode: 'a6db59ed-2550-404d-801a-244d3115cf82',
      });

      const errors = errorsData('recoveryCode');

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(passRes.status).toBe(HttpStatus.BAD_REQUEST);
      expect(passRes.body).toEqual(errors);
    });

    it("shouldn't recovery pass if incorreect pass", async () => {
      const { email, login, password } = userTest._createtUserData();

      await request(server).post(REGISTER_URL).send({ email, login, password });

      const res = await request(server).post(RECOVERY_PASS_URL).send({ email });

      const { recoveryCode } = await userTest.getRecoveryCode(email);

      const passRes = await request(server).post(NEW_PASS_URL).send({
        newPassword: '',
        recoveryCode: recoveryCode,
      });

      const errors = errorsData('newPassword');

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(passRes.status).toBe(HttpStatus.BAD_REQUEST);
      expect(passRes.body).toEqual(errors);
    });
  });

  describe('rate limit', () => {
    it('should be returned to many request 429 status code', async () => {
      const urls = [
        REGISTER_URL,
        CONFIRM_REGISTER_URL,
        LOGIN_URL,
        LOGOUT_URL,
        RESENDING_EMAIL_URL,
        RECOVERY_PASS_URL,
        NEW_PASS_URL,
      ];

      const resCount = 6;

      urls.map(async url => {
        for (let i = 0; i <= resCount; i++) {
          const res = await request(server).post(url);

          if (i === resCount) {
            expect(res.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
          }
        }
      });
    });
  });
});
