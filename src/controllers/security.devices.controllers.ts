import { Request, Response } from 'express';

import { UserSecurityDevicesQueryRepo } from '../repositories/security-devices/security.devices.query.repo';
import { UserSecurityDevicesRepo } from '../repositories/security-devices/security.devices.repo';
import { TypeRequestParams } from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export class UserSecurityDevicesController {
  constructor(
    protected userSecurityDevicesQueryRepo: UserSecurityDevicesQueryRepo,
    protected userSecurityDevicesRepo: UserSecurityDevicesRepo
  ) {}

  async getAllDevicesActiveByUser(req: Request, res: Response) {
    const result =
      await this.userSecurityDevicesQueryRepo.getAllDevicesActiveByUser(
        req.userId! // because i'm checking in jwtAuthMiddleware
      );

    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteAllDevicesExpectCurrentSession(req: Request, res: Response) {
    const { userId, ip, deviceId } = req;
    const deviceName = req.headers['user-agent'] ?? 'client';

    await this.userSecurityDevicesRepo.deleteAllDevicesExpectCurrentSession(
      userId!, // because i'm checking in jwtAuthMiddleware
      deviceId!
    );

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async deleteOneSessionByUserDevice(
    req: TypeRequestParams<{ deviceId: string }>,
    res: Response
  ) {
    const { userId, ip } = req;

    const device =
      await this.userSecurityDevicesQueryRepo.getOneDeviceByDeviceId(
        req.params.deviceId
      );

    if (!device) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found device by deviceId

    if (device.userId !== userId) return res.sendStatus(STATUS_CODE.FORBIDDEN); // it's another user's device

    await this.userSecurityDevicesRepo.deleteOneSessionByUserDevice(
      userId,
      device.deviceId,
      ip
    );

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }
}
