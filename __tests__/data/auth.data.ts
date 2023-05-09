import { validUserData } from './user.data';

export const AUTH_URL = '/auth/';

export const validLoginData = {
  loginOrEmail: validUserData.email,
  password: validUserData.password,
};
