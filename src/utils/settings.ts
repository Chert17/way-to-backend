export const SETTINGS = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  DB_NAME: process.env.DB_NAME || 'hw-03',
  BASIC_AUTH: process.env.BASIC_AUTH || 'admin:qwerty',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  EXPIRESIN_ACCESS_TOKEN: process.env.EXPIRESIN_ACCESS_TOKEN || '30m',
  EXPIRESIN_REFRESH_TOKEN: process.env.EXPIRESIN_REFRESH_TOKEN || '1h',
  TEST_EMAIL: process.env.TEST_EMAIL,
  TEST_PASS: process.env.TEST_PASS,
  COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY || false,
  COOKIE_SECURE: process.env.COOKIE_SECURE || false,
};
