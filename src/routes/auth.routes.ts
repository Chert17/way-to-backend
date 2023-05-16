import { Router } from 'express';

import {
  confirmRegistrationController,
  emailResendingController,
  getMeController,
  loginController,
  logoutController,
  newPasswordForUserController,
  passwordRecoveryController,
  refreshTokenController,
  registrationController,
} from '../controllers/auth.controllers';
import { checkRefreshTokenMiddleware } from '../middlewares/checkRefreshTokenMiddleware';
import { checkRequestRateLimitMiddleware } from '../middlewares/checkRequestRateLimitMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';
import { authRegisterConfirmRequestBodySchema } from '../validation/auth_login/auth.register.confirm.request.body.schema';
import { authRegisterRequestBodySchema } from '../validation/auth_login/auth.register.request.body.schema';
import { authResendingRequestBodySchema } from '../validation/auth_login/auth.resending.request.body.schema';
import { recoveryPasswordRequestBodySchema } from '../validation/auth_login/recovery.password.request.body.schema';
import { emailSchema } from '../validation/common/email.schema';
import { passwordSchema } from '../validation/common/password.schema';

export const authgRouter = Router();

authgRouter.post(
  '/login',
  checkRequestRateLimitMiddleware,
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  loginController
);

authgRouter.get('/me', jwtAuthMiddleware, getMeController);

authgRouter.post(
  '/registration',
  checkRequestRateLimitMiddleware,
  authRegisterRequestBodySchema,
  validateRequestMiddleware,
  registrationController
);

authgRouter.post(
  '/registration-confirmation',
  checkRequestRateLimitMiddleware,
  authRegisterConfirmRequestBodySchema,
  validateRequestMiddleware,
  confirmRegistrationController
);

authgRouter.post(
  '/registration-email-resending',
  checkRequestRateLimitMiddleware,
  authResendingRequestBodySchema,
  validateRequestMiddleware,
  emailResendingController
);

authgRouter.post(
  '/refresh-token',
  checkRefreshTokenMiddleware,
  refreshTokenController
);

authgRouter.post('/logout', checkRefreshTokenMiddleware, logoutController);

authgRouter.post(
  '/password-recovery',
  checkRequestRateLimitMiddleware,
  emailSchema,
  validateRequestMiddleware,
  passwordRecoveryController
);

authgRouter.post(
  '/new-password',
  checkRequestRateLimitMiddleware,
  recoveryPasswordRequestBodySchema,
  validateRequestMiddleware,
  newPasswordForUserController
);
