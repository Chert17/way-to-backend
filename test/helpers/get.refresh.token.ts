import request from 'supertest';

export const getRefreshTokenNameFromCookie = (res: request.Response) => {
  return res.headers['set-cookie']
    .find((cookie: any[]) => cookie.includes('refreshToken'))
    .split('=')[0];
};

export const getRefreshTokenValue = (res: request.Response) => {
  return res.headers['set-cookie'][0].split(';')[0].split('=')[1];
};
