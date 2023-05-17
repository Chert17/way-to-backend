import { JwtService } from '../../application/jwt.service';
import { AuthController } from '../../controllers/auth.controllers';
import { emailManager } from '../../managers/email.managers';
import { AuthService } from '../../service/auth.service';
import { userSecurityDevicesRepo } from '../security-devices/secutity.devices.composition';
import { AuthRepo } from './auth.repo';
import { TokenRepo } from './token.repo';

export const authRepo = new AuthRepo();
export const tokenRepo = new TokenRepo();
export const jwtService = new JwtService();
export const authService = new AuthService(
  authRepo,
  tokenRepo,
  jwtService,
  emailManager
);

export const authController = new AuthController(
  tokenRepo,
  authService,
  jwtService,
  userSecurityDevicesRepo
);
