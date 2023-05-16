import { compare } from 'bcrypt';
import { WithId } from 'mongodb';

import { IUserDb } from '../db/db.types';
import { converterUser } from '../helpers/converterToValidFormatData/converter.user';
import { generateHash } from '../helpers/generate.hash';
import { UserInputModel, UserViewModel } from '../models/users.models';
import { authRepo } from '../repositories/auth/auth.repo';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { userRepo } from '../repositories/users/user.repo';

export const userService = {
  createUser: async ({
    email,
    login,
    password,
  }: UserInputModel): Promise<UserViewModel | null> => {
    const passwordHash = await generateHash(password);

    const newUser: IUserDb = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      isConfirm: true,
    };

    const result = await userRepo.createUser(newUser);

    return result ? converterUser(result) : null;
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

    const result = await compare(password, user.passwordHash);

    if (!result) return null; // incorrect password from req.body

    return user;
  },

  updateUserPassword: async (
    recoveryCode: string,
    newPassword: string
  ): Promise<WithId<IUserDb> | null> => {
    const recoveryPasswordDate = await authRepo.getRecoveryPasswordDateByCode(
      recoveryCode
    );

    const { userEmail } = recoveryPasswordDate!; // because I'm check in recoveryPasswordRequestBodySchema

    const passwordHash = await generateHash(newPassword);

    const result = await userRepo.updateUserPassword(userEmail, passwordHash);

    if (!result) return null;

    return result;
  },
};
