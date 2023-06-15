import { UsersQueryRepo } from '../modules/users/repositories/users.query.repo';
import { UsersRepo } from '../modules/users/repositories/users.repo';

const queryRepositories = [UsersQueryRepo];

export const repositories = [UsersRepo, ...queryRepositories];
