const GLOBAL_PREFIX = '/api';

export const SA_URL = GLOBAL_PREFIX + '/sa/users';

const AUTH_URL = GLOBAL_PREFIX + '/auth';

export const authEndpoints = {
  REGISTER_URL: AUTH_URL + 'registration',
  CONFIRM_REGISTER_URL: AUTH_URL + 'registration-confirmation',
  RESENDING_EMAIL_URL: AUTH_URL + 'registration-email-resending',
  LOGIN_URL: AUTH_URL + 'login',
  GET_ME: AUTH_URL + '/me',
};

export const BLOG_URL = '/blogs/';

export const POST_URL = '/posts/';

export const COMMENT_URL = '/comments/';
