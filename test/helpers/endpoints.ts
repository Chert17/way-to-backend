const GLOBAL_PREFIX = '/api';

export const SA_URL = GLOBAL_PREFIX + '/sa/users';

const AUTH_URL = GLOBAL_PREFIX + '/auth';

export const authEndpoints = {
  REGISTER_URL: AUTH_URL + '/registration',
  CONFIRM_REGISTER_URL: AUTH_URL + '/registration-confirmation',
  RESENDING_EMAIL_URL: AUTH_URL + '/registration-email-resending',
  LOGIN_URL: AUTH_URL + '/login',
  REFRESH_TOKEN_URL: AUTH_URL + '/refresh-token',
  LOGOUT_URL: AUTH_URL + '/logout',
  RECOVERY_PASS_URL: AUTH_URL + '/password-recovery',
  NEW_PASS_URL: AUTH_URL + '/new-password',
  GET_ME: AUTH_URL + '/me',
};

export const BLOG_URL = '/blogs/';

export const POST_URL = '/posts/';

export const COMMENT_URL = '/comments/';

export const DEVICE_URL = GLOBAL_PREFIX + '/security/devices';
