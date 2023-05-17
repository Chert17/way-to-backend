import { UserSecurityDevicesController } from '../../controllers/security.devices.controllers';
import { UserSecurityDevicesQueryRepo } from './security.devices.query.repo';
import { UserSecurityDevicesRepo } from './security.devices.repo';

const userSecurityDevicesQueryRepo = new UserSecurityDevicesQueryRepo();
export const userSecurityDevicesRepo = new UserSecurityDevicesRepo();

export const userSecurityDevicesController = new UserSecurityDevicesController(
  userSecurityDevicesQueryRepo,
  userSecurityDevicesRepo
);
