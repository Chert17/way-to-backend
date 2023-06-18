import { Device } from '../../users/entities/devices';

export interface DeviceDb extends Device {
  user_id: string;
}
