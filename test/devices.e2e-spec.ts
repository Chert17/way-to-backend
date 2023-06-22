import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { DEVICE_URL } from './helpers/endpoints';
import { UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

describe('devices e2e', () => {
  let server: any;

  let userTest: UserTest;

  beforeAll(async () => {
    process.env.THROTTLR_LIMIT = 1000 + '';

    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('get all devices', () => {
    it('should be returned all devices', async () => {
      const [device0, device1] = await userTest.createDevices(2);

      const res = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

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

  describe('delete device by id', () => {
    it('should be delete device by id', async () => {
      const [device0, device1] = await userTest.createDevices(2);

      const devices = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      const res = await request(server)
        .delete(DEVICE_URL + `/${devices.body[0].deviceId}`)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      const expectDevices = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device1.refreshToken}`);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(expectDevices.body).toHaveLength(1);
    });

    it("shouldn't delete device if not exist device", async () => {
      const [device0] = await userTest.createDevices(1);

      const res = await request(server)
        .delete(DEVICE_URL + `/2a6b5dc8-a865-4a5e-8bd8-cd93a332ce2a`)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't delete device if other owner", async () => {
      const [device0] = await userTest.createDevices(1);
      const [device1] = await userTest.createDevices(1);

      const devices = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      const res = await request(server)
        .delete(DEVICE_URL + `/${devices.body[0].deviceId}`)
        .set('Cookie', `refreshToken=${device1.refreshToken}`);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't delete device if incorrect refresh token", async () => {
      const [device0] = await userTest.createDevices(1);

      const devices = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      const res = await request(server).delete(
        DEVICE_URL + `/${devices.body[0].deviceId}`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('delete all devices except current', () => {
    it('should be delete all devices expect current', async () => {
      const [device0] = await userTest.createDevices(3);

      const res = await request(server)
        .delete(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      const devices = await request(server)
        .get(DEVICE_URL)
        .set('Cookie', `refreshToken=${device0.refreshToken}`);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(devices.body).toHaveLength(1);
      expect(device0.userAgent).toEqual(devices.body[0].title);
    });

    it("shouldn't delete all if incorrect refresh token", async () => {
      await userTest.createDevices(2);

      const res = await request(server)
        .delete(DEVICE_URL)
        .set('Cookie', `refreshToken=refreshToken`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
