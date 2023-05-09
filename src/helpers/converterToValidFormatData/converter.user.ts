import { WithId } from 'mongodb';

import { IUserDb } from '../../db/db.types';
import { UserViewModel } from '../../models/users.models';

export const converterUser = (user: WithId<IUserDb>): UserViewModel => ({
  id: user._id.toString(),
  email: user.email,
  login: user.login,
  createdAt: user.createdAt,
});
