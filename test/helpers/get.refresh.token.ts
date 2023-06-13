import request from 'supertest';

export const getRefreshToken = (res: request.Response) =>
  res.headers['set-cookie'][0].split(';')[0].split('=')[1];
