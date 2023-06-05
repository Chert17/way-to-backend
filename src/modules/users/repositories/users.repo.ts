import { Model, Types, UpdateWriteOpResult } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { EmailInfo } from '../schemas/email.info.schema';
import { User } from '../schemas/users.schema';

@Injectable()
export class UsersRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(newUser: User): Promise<DbType<User>> {
    return await this.userModel.create(newUser);
  }

  async deleteUser(userId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(userId);

    if (!convertId) return false;

    const user = await this.userModel.deleteOne({ _id: convertId });

    return user.deletedCount === 1;
  }

  async checkUserById(userId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(userId);

    if (!convertId) return false;

    const user = await this.userModel.countDocuments({ _id: convertId });

    return !!user;
  }

  async checkAndGetUserById(userId: string): Promise<DbType<User> | false> {
    const convertId = tryConvertToObjectId(userId);

    if (!convertId) return false;

    return await this.userModel.findById(convertId).lean();
  }

  async getConfirmEmailByCode(code: string): Promise<EmailInfo | null> {
    const result = await this.userModel
      .findOne({ 'emailInfo.confirmationCode': code }, { emailInfo: 1, _id: 0 })
      .lean();

    if (!result) return null;

    return { ...result.emailInfo };
  }

  async getConfirmEmailByEmail(email: string): Promise<EmailInfo | null> {
    const result = await this.userModel
      .findOne({ 'accountData.email': email }, { emailInfo: true })
      .lean();

    if (!result) return null;

    return { ...result.emailInfo };
  }

  async getUserByEmailOrLogin(loginOrEmail: string) {
    const result = await this.userModel.findOne({
      $or: [
        { 'accountData.email': loginOrEmail },
        { 'accountData.login': loginOrEmail },
      ],
    });

    return result;
  }

  async getUserPasswordInfoByRecoveryPassword(recoveryCode: string) {
    const result = await this.userModel.findOne(
      {
        'passwordRecoveryInfo.recoveryCode': recoveryCode,
      },
      { passwordRecoveryInfo: 1 },
    );

    return { userId: result._id, ...result.passwordRecoveryInfo };
  }

  async updateConfirmEmailStatus(code: string): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { 'emailInfo.confirmationCode': code },
      { $set: { 'emailInfo.isConfirmed': true } },
      { returnDocument: 'after' },
    );
  }

  async updateConfirmCodeByEmail(
    email: string,
    newConfirmCode: string,
    newExpirationDate: Date,
  ) {
    return await this.userModel.updateOne(
      { 'accountData.email': email },
      {
        $set: {
          'emailInfo.confirmationCode': newConfirmCode,
          'emailInfo.expirationDate': newExpirationDate,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async updatePasswordRecoveryInfo(
    userId: Types.ObjectId,
    recoveryCode: string,
    newExpirationDate: Date,
  ) {
    return await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          'passwordRecoveryInfo.recoveryCode': recoveryCode,
          'passwordRecoveryInfo.expirationDate': newExpirationDate,
          'passwordRecoveryInfo.isConfirmed': false,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async createNewPasswordForUser(userId: Types.ObjectId, passwordHash: string) {
    return await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          'passwordRecoveryInfo.isConfirmed': true,
          'accountData.passwordHash': passwordHash,
        },
      },
    );
  }

  async checkUserByLoginOrEmail(loginOrEmail: string): Promise<boolean> {
    const result = await this.userModel.findOne({
      $or: [
        { 'accountData.email': loginOrEmail },
        { 'accountData.login': loginOrEmail },
      ],
    });

    return !!result;
  }
}
