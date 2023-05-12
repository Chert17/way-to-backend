export const SETTINGS = {
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://andriichertkov:Andrey007001@cluster0.dysp4zj.mongodb.net/hw-03',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  TEST_EMAIL: process.env.TEST_EMAIL || 'dolbaeb1717@gmail.com',
  TEST_PASS: process.env.TEST_PASS || 'uykiowyjospmpmqr',
  EXPIRESIN_ACCESS_TOKEN: process.env.EXPIRESIN_ACCESS_TOKEN || '10m',
  EXPIRESIN_REFRESH_TOKEN: process.env.EXPIRESIN_REFRESH_TOKEN || '20m',
};
