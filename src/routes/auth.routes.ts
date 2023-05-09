import { Router } from 'express';

import {
  confirmRegistrationController,
  emailResendingController,
  getMeController,
  loginController,
  registrationController,
} from '../controllers/auth.controllers';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';
import { authRegisterConfirmRequestBodySchema } from '../validation/auth_login/auth.register.confirm.request.body.schema';
import { authRegisterRequestBodySchema } from '../validation/auth_login/auth.register.request.body.schema';
import { authResendingRequestBodySchema } from '../validation/auth_login/auth.resending.request.body.schema';

export const authgRouter = Router();

authgRouter.post(
  '/login',
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  loginController
);

authgRouter.get('/me', jwtAuthMiddleware, getMeController);

authgRouter.post(
  '/registration',
  authRegisterRequestBodySchema,
  validateRequestMiddleware,
  registrationController
);

authgRouter.post(
  '/registration-confirmation',
  authRegisterConfirmRequestBodySchema,
  validateRequestMiddleware,
  confirmRegistrationController
);

authgRouter.post(
  '/registration-email-resending',
  authResendingRequestBodySchema,
  validateRequestMiddleware,
  emailResendingController
);
