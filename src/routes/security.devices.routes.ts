import { Router } from 'express';

import { checkRefreshTokenMiddleware } from '../middlewares/checkRefreshTokenMiddleware';
import { userSecurityDevicesController } from '../repositories/security-devices/secutity.devices.composition';

export const secutityDeviceRouter = Router();

secutityDeviceRouter.get(
  '/devices',
  checkRefreshTokenMiddleware,
  userSecurityDevicesController.getAllDevicesActiveByUser.bind(
    userSecurityDevicesController
  )
);

secutityDeviceRouter.delete(
  '/devices',
  checkRefreshTokenMiddleware,
  userSecurityDevicesController.deleteAllDevicesExpectCurrentSession.bind(
    userSecurityDevicesController
  )
);

secutityDeviceRouter.delete(
  '/devices/:deviceId',
  checkRefreshTokenMiddleware,
  userSecurityDevicesController.deleteOneSessionByUserDevice.bind(
    userSecurityDevicesController
  )
);
