import request from 'supertest';

// export const getRefreshTokenNameFromCookie = (res: request.Response) => {
//   return res.headers['set-cookie']
//     .find((cookie: any[]) => cookie.includes('refreshToken'))
//     .split('=')[0];
// };

// export const getRefreshTokenValue = (res: request.Response) => {
//   return res.headers['set-cookie'][0].split(';')[0].split('=')[1];
// };

export const getRefreshToken = (
  res: request.Response,
): { name: string; value: string } => {
  const cookie = res.headers['set-cookie'];

  const name = cookie
    .find((cookie: any[]) => cookie.includes('refreshToken'))
    .split('=')[0];

  const value = cookie[0].split(';')[0].split('=')[1];

  return { name, value };
};
