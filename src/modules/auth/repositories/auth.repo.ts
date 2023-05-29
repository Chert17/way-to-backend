import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ConfirmEmail } from '../schemas/confirm.email.schema';

@Injectable()
export class AuthRepo {
  constructor(
    @InjectModel(ConfirmEmail.name)
    private confirmEmailModel: Model<ConfirmEmail>,
  ) {}

  async userConfirmEmail(confirmEmailData: ConfirmEmail) {
    return await this.confirmEmailModel.create(confirmEmailData);
  }
}
