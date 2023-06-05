import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AccountData, AccountDataSchema } from './account.data.schema';
import { BanInfo, BanInfoSchema } from './ban.info.schema';
import { EmailInfo, EmailInfoSchema } from './email.info.schema';
import {
  PasswordRecoveryInfo,
  PasswordRecoveryInfoSchema,
} from './recovery.code.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ required: true, type: EmailInfoSchema })
  emailInfo: EmailInfo;

  @Prop({ required: true, type: PasswordRecoveryInfoSchema })
  passwordRecoveryInfo: PasswordRecoveryInfo;

  @Prop({ required: true, type: BanInfoSchema })
  banInfo: BanInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
