import { compare } from 'bcrypt';
import { WithId } from 'mongodb';

import { IUserDb } from '../db/db.types';
import { converterUser } from '../helpers/converterToValidFormatData/converter.user';
import { generateHash } from '../helpers/generate.hash';
import { UserInputModel, UserViewModel } from '../models/users.models';
import { AuthRepo } from '../repositories/auth/auth.repo';
import { UserQueryRepo } from '../repositories/users/user.query.repo';
import { UserRepo } from '../repositories/users/user.repo';

export class UserService {
  constructor(
    protected userQueryRepo: UserQueryRepo,
    protected userRepo: UserRepo,
    protected authRepo: AuthRepo
  ) {}

  async createUser({
    email,
    login,
    password,
  }: UserInputModel): Promise<UserViewModel | null> {
    const passwordHash = await generateHash(password);

    const newUser: IUserDb = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      isConfirm: true,
    };

    const result = await this.userRepo.createUser(newUser);

    return result ? converterUser(result) : null;
  }

  async deleteUser(id: string): Promise<WithId<IUserDb> | null> {
    return await this.userRepo.deleteUser(id);
  }

  async updateUserPassword(
    recoveryCode: string,
    newPassword: string
  ): Promise<WithId<IUserDb> | null> {
    const recoveryPasswordDate =
      await this.authRepo.getRecoveryPasswordDateByCode(recoveryCode);

    const { userEmail } = recoveryPasswordDate!; // because I'm check in recoveryPasswordRequestBodySchema

    const passwordHash = await generateHash(newPassword);

    const result = await this.userRepo.updateUserPassword(
      userEmail,
      passwordHash
    );

    if (!result) return null;

    return result;
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<WithId<IUserDb> | null> {
    const user = await this.userQueryRepo.checkUserCredentials(loginOrEmail);

    if (!user) return null;

    const result = await compare(password, user.passwordHash);

    if (!result) return null; // incorrect password from req.body

    return user;
  }
}
