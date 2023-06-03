import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Devices {
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  deviceId: string;

  @Prop({ required: true, type: String })
  ip: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Date })
  lastActiveDate: Date;
}

export const DevicesSchema = SchemaFactory.createForClass(Devices);
