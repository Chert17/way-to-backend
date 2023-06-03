export class CreateDevicesServiceDto {
  readonly userId: string;
  readonly ip: string;
  readonly deviceName: string;
  readonly deviceId: string;
  readonly lastActiveDate: Date;
}

export class CreateDevicesDbDto {
  readonly userId: string;
  readonly ip: string;
  readonly title: string;
  readonly deviceId: string;
  readonly lastActiveDate: Date;
}
