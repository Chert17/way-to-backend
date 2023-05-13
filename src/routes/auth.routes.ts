import { Router } from "express";

import {
  confirmRegistrationController,
  emailResendingController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registrationController
} from "../controllers/auth.controllers";
import { checkRefreshTokenMiddleware } from "../middlewares/checkRefreshTokenMiddleware";
import { checkRequestRateLimitMiddleware } from "../middlewares/checkRequestRateLimitMiddleware";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware";
import { authLoginRequestBodySchema } from "../validation/auth_login/auth.login.request.body.schema";
import { authRegisterConfirmRequestBodySchema } from "../validation/auth_login/auth.register.confirm.request.body.schema";
import { authRegisterRequestBodySchema } from "../validation/auth_login/auth.register.request.body.schema";
import { authResendingRequestBodySchema } from "../validation/auth_login/auth.resending.request.body.schema";

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
