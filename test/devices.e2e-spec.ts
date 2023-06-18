import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { DEVICE_URL } from './helpers/endpoints';
import { UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

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

  describe('devices e2e', () => {
    describe('get all devices', () => {
      it('should be returned all devices', async () => {
        const [device0, device1] = await userTest.createDevices(2);

        const res = await request(server)
          .get(DEVICE_URL)
          .set('Cookie', `refreshToken=${device0.refreshToken}`);

        console.log('TEST', res.body);

        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body).toEqual([
          {
            ip: expect.any(String),
            title: device0.userAgent,
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
          },
          {
            ip: expect.any(String),
            title: device1.userAgent,
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
          },
        ]);
      });

      it("shouldn't returned devices if refresh token incorrect", async () => {
        await userTest.createDevices(1);

        const res = await request(server).get(DEVICE_URL);

        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
