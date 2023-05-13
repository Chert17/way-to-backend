import { Request, Response } from "express";

import { jwtService } from "../application/jwt.service";
import { userSecurityDevicesQueryRepo } from "../repositories/security-devices/security.devices.query.repo";
import { userSecurityDevicesRepo } from "../repositories/security-devices/security.devices.repo";
import { TypeRequestParams } from "../types/req-res.types";
import { STATUS_CODE } from "../utils/status.code";

export const getAllDevicesActiveByUser = async (
  req: Request,
  res: Response
) => {
  const result = await userSecurityDevicesQueryRepo.getAllDevicesActiveByUser(
    req.userId! // because i'm checking in jwtAuthMiddleware
  );

  return res.status(STATUS_CODE.OK).json(result);
};

export const deleteAllDevicesExpectCurrentSessionController = async (
  req: Request,
  res: Response
) => {
  const { userId, ip, deviceId } = req;
  const deviceName = req.headers['user-agent'] ?? 'client';

  await userSecurityDevicesRepo.deleteAllDevicesExpectCurrentSession(
    userId!, // because i'm checking in jwtAuthMiddleware
    deviceId!
  );

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const deleteOneSessionByUserDevice = async (
  req: TypeRequestParams<{ deviceId: string }>,
  res: Response
) => {
  const { userId, ip } = req;

  const device = await userSecurityDevicesQueryRepo.getOneDeviceByDeviceId(
    req.params.deviceId
  );

  if (!device) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found device by deviceId

  if (device.userId !== userId) return res.sendStatus(STATUS_CODE.FORBIDDEN); // it's another user's device

  await userSecurityDevicesRepo.deleteOneSessionByUserDevice(
    userId,
    device.deviceId,
    ip
  );

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};
