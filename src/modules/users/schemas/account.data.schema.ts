import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, id: false, versionKey: false })
export class AccountData {
  @Prop({ required: true, unique: true, type: String })
  login: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);
