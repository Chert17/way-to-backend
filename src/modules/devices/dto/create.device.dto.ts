export class CreateDevicesServiceDto {
  readonly userId: string;
  readonly ip: string;
  readonly title: string;
  readonly deviceId: string;
  readonly lastActiveDate: string;
}

export class CreateDevicesDbDto {
  readonly userId: string;
  readonly ip: string;
  readonly title: string;
  readonly deviceId: string;
  readonly lastActiveDate: string;
}
