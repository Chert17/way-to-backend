import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, require: true, length: { min: 3, max: 10 } })
  login: string;

  @Prop({ type: String, require: true })
  email: string;

  @Prop({ type: String, require: true })
  passwordHash: string;

  @Prop({ type: Date, require: true, default: new Date() })
  createdAt: string;

  @Prop({ type: Boolean, require: true, default: false })
  isConfirm: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
