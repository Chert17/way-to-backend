import { Router } from 'express'; //

import { checkRefreshTokenMiddleware } from '../middlewares/checkRefreshTokenMiddleware';
import { checkRequestRateLimitMiddleware } from '../middlewares/checkRequestRateLimitMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authController } from '../repositories/auth/auth.composition';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';
import { authRegisterConfirmRequestBodySchema } from '../validation/auth_login/auth.register.confirm.request.body.schema';
import { authRegisterRequestBodySchema } from '../validation/auth_login/auth.register.request.body.schema';
import { authResendingRequestBodySchema } from '../validation/auth_login/auth.resending.request.body.schema';
import { recoveryPasswordRequestBodySchema } from '../validation/auth_login/recovery.password.request.body.schema';
import { emailSchema } from '../validation/common/email.schema';

export const authgRouter = Router();

authgRouter.get(
  '/me',
  jwtAuthMiddleware,
  authController.getMe.bind(authController)
);

authgRouter.post(
  '/login',
  checkRequestRateLimitMiddleware,
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  authController.login.bind(authController)
);

authgRouter.post(
  '/registration',
  checkRequestRateLimitMiddleware,
  authRegisterRequestBodySchema,
  validateRequestMiddleware,
  authController.registration.bind(authController)
);

authgRouter.post(
  '/registration-confirmation',
  checkRequestRateLimitMiddleware,
  authRegisterConfirmRequestBodySchema,
  validateRequestMiddleware,
  authController.confirmRegistration.bind(authController)
);

authgRouter.post(
  '/registration-email-resending',
  checkRequestRateLimitMiddleware,
  authResendingRequestBodySchema,
  validateRequestMiddleware,
  authController.emailResending.bind(authController)
);

authgRouter.post(
  '/refresh-token',
  checkRefreshTokenMiddleware,
  authController.refreshToken.bind(authController)
);

authgRouter.post(
  '/logout',
  checkRefreshTokenMiddleware,
  authController.logout.bind(authController)
);

authgRouter.post(
  '/password-recovery',
  checkRequestRateLimitMiddleware,
  emailSchema,
  validateRequestMiddleware,
  authController.recoveryPassword.bind(authController)
);

authgRouter.post(
  '/new-password',
  checkRequestRateLimitMiddleware,
  recoveryPasswordRequestBodySchema,
  validateRequestMiddleware,
  authController.newPasswordForUser.bind(authController)
);
