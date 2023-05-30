import { Model, UpdateWriteOpResult } from 'mongoose';

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

  async getConfirmEmailByCode(code: string): Promise<EmailInfo> {
    return await this.userModel
      .findOne({ 'emailInfo.confirmationCode': code }, { emailInfo: true })
      .lean();
  }

  async getConfirmEmailByEmail(email: string): Promise<EmailInfo> {
    return await this.userModel
      .findOne({ 'accountData.email': email }, { emailInfo: true })
      .lean();
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
}
