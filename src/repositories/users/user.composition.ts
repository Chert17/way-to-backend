import { UserController } from '../../controllers/user.controllers';
import { UserService } from '../../service/user.service';
import { AuthRepo } from '../auth/auth.repo';
import { UserQueryRepo } from './user.query.repo';
import { UserRepo } from './user.repo';

export const userQueryRepo = new UserQueryRepo();
const userRepo = new UserRepo();
const authRepo = new AuthRepo();
export const userService = new UserService(userQueryRepo, userRepo, authRepo);

export const userController = new UserController(userQueryRepo, userService);
