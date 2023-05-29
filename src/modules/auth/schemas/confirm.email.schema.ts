import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConfirmEmailDocument = HydratedDocument<ConfirmEmail>;

@Schema()
export class ConfirmEmail {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ type: String, require: true })
  confirmationCode: string;

  @Prop({ type: Date, require: true })
  expirationDate: Date;

  @Prop({ type: Boolean, require: true })
  isConfirm: boolean;
}

export const ConfirmEmailSchema = SchemaFactory.createForClass(ConfirmEmail);
