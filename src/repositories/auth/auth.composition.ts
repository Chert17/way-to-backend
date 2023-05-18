import { JwtService } from '../../application/jwt.service';
import { AuthController } from '../../controllers/auth.controllers';
import { EmailManager } from '../../managers/email.managers';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { UserSecurityDevicesRepo } from '../security-devices/security.devices.repo';
import { UserQueryRepo } from '../users/user.query.repo';
import { UserRepo } from '../users/user.repo';
import { AuthRepo } from './auth.repo';
import { TokenRepo } from './token.repo';

const jwtService = new JwtService();
const emailManager = new EmailManager();
const userQueryRepo = new UserQueryRepo();
const userRepo = new UserRepo();
const userSecurityDevicesRepo = new UserSecurityDevicesRepo();

const authRepo = new AuthRepo();

const userService = new UserService(userQueryRepo, userRepo, authRepo);

const tokenRepo = new TokenRepo();
const authService = new AuthService(
  authRepo,
  tokenRepo,
  jwtService,
  emailManager
);

export const authController = new AuthController(
  tokenRepo,
  authService,
  jwtService,
  userQueryRepo,
  userService,
  userSecurityDevicesRepo
);
