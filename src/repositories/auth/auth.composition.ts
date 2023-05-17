import { JwtService } from '../../application/jwt.service';
import { AuthController } from '../../controllers/auth.controllers';
import { AuthService } from '../../service/auth.service';
import { AuthRepo } from './auth.repo';
import { TokenRepo } from './token.repo';

export const authRepo = new AuthRepo();
export const tokenRepo = new TokenRepo();
export const jwtService = new JwtService();
export const authService = new AuthService(authRepo, tokenRepo, jwtService);

export const authController = new AuthController(
  tokenRepo,
  authService,
  jwtService
);
