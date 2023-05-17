import { UserController } from '../../controllers/user.controllers';
import { UserService } from '../../service/user.service';
import { authRepo } from '../auth/auth.composition';
import { UserQueryRepo } from './user.query.repo';
import { UserRepo } from './user.repo';

export const userQueryRepo = new UserQueryRepo();
const userRepo = new UserRepo();
export const userService = new UserService(userQueryRepo, userRepo, authRepo);

export const userController = new UserController(userQueryRepo, userService);
