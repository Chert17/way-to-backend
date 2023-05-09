import { genSalt } from 'bcrypt';
import { WithId } from 'mongodb';

import { IUserDb } from '../db/db.types';
import { converterUser } from '../helpers/converterToValidFormatData/converter.user';
import { generateHash } from '../helpers/generate.hash';
import { UserInputModel, UserViewModel } from '../models/users.models';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { userRepo } from '../repositories/users/user.repo';

export const userService = {
  createUser: async ({
    email,
    login,
    password,
  }: UserInputModel): Promise<UserViewModel | null> => {
    const passwordSalt = await genSalt(10);
    const passwordHash = await generateHash(password, passwordSalt);

    const newUser: IUserDb = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      isConfirm: true,
    };

    const result = await userRepo.createUser(newUser);

    return result ? converterUser({ ...newUser, _id: result }) : null;
  },

  deleteUser: async (id: string): Promise<WithId<IUserDb> | null> => {
    return await userRepo.deleteUser(id);
  },

  checkCredentials: async (
    loginOrEmail: string,
    password: string
  ): Promise<WithId<IUserDb> | null> => {
    const user = await userQueryRepo.checkUserCredentials(loginOrEmail);

    if (!user) return null;

    const passwordHash = await generateHash(password, user.passwordSalt);

    if (passwordHash !== user.passwordHash) return null; // incorrect password from req.body

    return user;
  },
};
