import { UsersQueryRepo } from '../modules/users/repositories/users.query.repo';

const queryRepositories = [UsersQueryRepo];

export const repositories = [...queryRepositories];
