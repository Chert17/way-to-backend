import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, id: false, versionKey: false })
export class EmailInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ required: true, type: String })
  confirmationCode: string;

  @Prop({ required: true, type: Date })
  expirationDate: Date;
}

export const EmailInfoSchema = SchemaFactory.createForClass(EmailInfo);
