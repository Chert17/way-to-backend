import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, id: false, versionKey: false })
export class PasswordRecoveryInfo {
  @Prop({ required: true, type: Boolean, default: true })
  isConfirmed: boolean;

  @Prop({ type: String })
  recoveryCode: string;
}

export const PasswordRecoveryInfoSchema =
  SchemaFactory.createForClass(PasswordRecoveryInfo);
