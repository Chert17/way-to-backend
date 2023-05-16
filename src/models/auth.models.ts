import { type } from 'os';

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeViewMOdel = {
  email: string;
  login: string;
  userId: string;
};

export type RegisterInputModel = {
  login: string;
  email: string;
  password: string;
};

export type TokensViewModel = {
  accessToken: string;
  refreshToken: string;
};

export type DeviceViewModel = {
  id: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export type LoginInputServiceModel = {
  loginOrEmail: string;
  password: string;
  ip: string;
  deviceName: string;
};

export type NewPasswordRecoveryInputModel = {
  newPassword: string;
  recoveryCode: string;
};
