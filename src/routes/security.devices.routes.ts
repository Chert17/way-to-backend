import { Router } from "express";

import {
  deleteAllDevicesExpectCurrentSessionController,
  deleteOneSessionByUserDevice,
  getAllDevicesActiveByUser
} from "../controllers/security.devices.controllers";
import { checkRefreshTokenMiddleware } from "../middlewares/checkRefreshTokenMiddleware";

export const secutityDeviceRouter = Router();

secutityDeviceRouter.get(
  '/devices',
  checkRefreshTokenMiddleware,
  getAllDevicesActiveByUser
);

secutityDeviceRouter.delete(
  '/devices',
  checkRefreshTokenMiddleware,
  deleteAllDevicesExpectCurrentSessionController
);

secutityDeviceRouter.delete(
  '/devices/:deviceId',
  checkRefreshTokenMiddleware,
  deleteOneSessionByUserDevice
);
